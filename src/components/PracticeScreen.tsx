import React, { useState, useEffect, useRef } from 'react';
import { PracticeTurn, TurnRecord, FeedbackInfo, RoundNumber } from '../types';
import { SamAvatar } from './Illustrations';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { playTextToSpeech } from '../utils/speechUtils';
import { evaluateSpeech, getSentenceWithGaps, extractWords } from '../utils/feedbackEngine';

interface PracticeScreenProps {
  turn: PracticeTurn;
  turnIndex: number;
  totalTurns: number;
  round: RoundNumber;
  onNextTurn: (record: TurnRecord) => void;
  onSkipTurn: (record: TurnRecord) => void;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({
  turn,
  turnIndex,
  totalTurns,
  round,
  onNextTurn,
  onSkipTurn,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackInfo | null>(null);
  const [tryCount, setTryCount] = useState<number>(0);
  const [consecutiveNoSpeechCount, setConsecutiveNoSpeechCount] = useState<number>(0);
  const [lastUserSaid, setLastUserSaid] = useState<string>('');
  const [isSentenceRevealed, setIsSentenceRevealed] = useState<boolean>(false);

  const stopAudioRef = useRef<(() => void) | null>(null);

  // Stop any active speech synthesis
  const cancelAudio = () => {
    if (stopAudioRef.current) {
      stopAudioRef.current();
      stopAudioRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  // Play audio helper
  const handlePlayAudio = (text: string, rate: number) => {
    cancelAudio();
    setIsPlayingAudio(true);
    const cancel = playTextToSpeech(
      text,
      rate,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
    stopAudioRef.current = cancel;
  };

  // Read Sam's question once when the turn loads
  useEffect(() => {
    // Reset state for new turn
    setFeedback(null);
    setTryCount(0);
    setConsecutiveNoSpeechCount(0);
    setLastUserSaid('');
    setIsSentenceRevealed(false);

    // Read Sam's question aloud once
    const timer = setTimeout(() => {
      handlePlayAudio(turn.partnerPrompt, 0.9);
    }, 300);

    return () => {
      clearTimeout(timer);
      cancelAudio();
    };
  }, [turn.id, round]);

  // Handle student's speech completion
  const handleFinalSpeech = (transcript: string) => {
    setLastUserSaid(transcript);

    // If no speech recognized
    if (!transcript.trim()) {
      const nextNoSpeech = consecutiveNoSpeechCount + 1;
      setConsecutiveNoSpeechCount(nextNoSpeech);

      // In Round 3, 2 consecutive no-speech also reveals the sentence
      if (nextNoSpeech >= 2 && round === 3) {
        setIsSentenceRevealed(true);
      }

      // No-speech results do not count as failed tries for the recast ladder
      const emptyFeedback = evaluateSpeech('', turn, tryCount);
      setFeedback(emptyFeedback);
      return;
    }

    // Valid speech recognized -> reset consecutive no-speech counter
    setConsecutiveNoSpeechCount(0);

    const studentWords = extractWords(transcript);
    // Tolerance for plurals/simple variations
    const missingKeyWords = turn.keyWords.filter((kw) => {
      const t = kw.toLowerCase();
      return !studentWords.some((w) => {
        if (w === t) return true;
        if (t === 'backpack' && (w === 'backpacks' || w === 'bag' || w === 'pack')) return true;
        if (t === 'thank' && (w === 'thanks' || w === 'thanked')) return true;
        if (t === 'help' && (w === 'helping' || w === 'helps')) return true;
        if (t === 'book' && w === 'books') return true;
        return false;
      });
    });

    if (missingKeyWords.length === 0) {
      // Success!
      const resultFeedback = evaluateSpeech(transcript, turn, tryCount);
      setFeedback(resultFeedback);
    } else {
      // Failed attempt -> advance try count (1st recast -> 2nd hint -> 3rd chunking)
      const nextTry = tryCount + 1;
      setTryCount(nextTry);
      const resultFeedback = evaluateSpeech(transcript, turn, nextTry);
      setFeedback(resultFeedback);
    }
  };

  const {
    micState,
    transcript,
    errorMessage,
    startListening,
    stopListening,
    resetMic,
  } = useSpeechRecognition({
    onFinalResult: handleFinalSpeech,
  });

  const handleMicTap = () => {
    if (isPlayingAudio) return;

    if (micState === 'listening') {
      stopListening();
    } else {
      resetMic();
      startListening();
    }
  };

  const handleTryAgain = () => {
    cancelAudio();
    resetMic();
    setLastUserSaid('');
    setFeedback(null);
  };

  const handleNextClick = () => {
    cancelAudio();
    const isCompleted = feedback?.isSuccess ?? false;
    onNextTurn({
      turnId: turn.id,
      targetSentence: turn.targetSentence,
      targetSentenceKo: turn.targetSentenceKo,
      status: isCompleted ? 'said' : 'skipped',
      tries: tryCount,
      lastTranscript: lastUserSaid,
    });
  };

  const handleSkipClick = () => {
    cancelAudio();
    onSkipTurn({
      turnId: turn.id,
      targetSentence: turn.targetSentence,
      targetSentenceKo: turn.targetSentenceKo,
      status: 'skipped',
      tries: tryCount,
      lastTranscript: lastUserSaid,
    });
  };

  // Check what to show in Middle Zone depending on round
  const isRound3Hidden = round === 3 && !isSentenceRevealed;

  return (
    <div className="flex flex-col min-h-full px-4 py-4 justify-between animate-fadeIn">
      {/* Top Zone: Progress + Sam's Question Bubble */}
      <div>
        {/* Progress header: Round 1 · 1 / 5 */}
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>LOST & FOUND DESK</span>
          <span className="text-blue-600 font-bold text-sm">
            Round {round} · {turnIndex + 1} / {totalTurns}
          </span>
        </div>

        {/* Sam's speech bubble */}
        <div className="flex items-start gap-3 mt-1">
          <SamAvatar size={42} />
          <div className="flex-1 bg-white border border-blue-100 rounded-2xl rounded-tl-sm p-3.5 shadow-xs relative">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold text-blue-600">Sam</span>
              <button
                type="button"
                onClick={() => handlePlayAudio(turn.partnerPrompt, 0.9)}
                disabled={isPlayingAudio}
                className="text-slate-400 hover:text-blue-600 disabled:opacity-40 p-1 cursor-pointer transition-colors"
                title="Listen to Sam again"
                aria-label="Replay Sam's question"
              >
                🔊
              </button>
            </div>
            <p className="text-[15px] font-medium text-slate-800 leading-snug mt-0.5">
              {turn.partnerPrompt}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {turn.partnerPromptKo}
            </p>
          </div>
        </div>
      </div>

      {/* Middle Zone: Target Sentence / Gaps / Round 3 Key Words */}
      <div className="my-auto py-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-center flex flex-col items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            {round === 1
              ? 'Say this (목표 문장)'
              : round === 2
              ? 'Fill the gaps (빈칸 채우기)'
              : 'Talk to Sam (Sam에게 말하기)'}
          </span>

          {/* Round 1 or Revealed Round 3: Full Target Sentence */}
          {(round === 1 || (round === 3 && isSentenceRevealed)) && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 leading-snug my-1 tracking-tight">
                &ldquo;{turn.targetSentence}&rdquo;
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 mb-4">
                {turn.targetSentenceKo}
              </p>
            </>
          )}

          {/* Round 2: Target sentence with gaps */}
          {round === 2 && (
            <>
              <h2 className="text-2xl font-bold text-slate-900 leading-snug my-1 tracking-tight font-mono tracking-wider">
                &ldquo;{getSentenceWithGaps(turn.targetSentence, turn.keyWords)}&rdquo;
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 mb-4">
                {turn.targetSentenceKo}
              </p>
            </>
          )}

          {/* Round 3 Hidden: Korean meaning + Key word cards */}
          {isRound3Hidden && (
            <>
              <p className="text-base font-bold text-slate-900 leading-snug my-1.5">
                &ldquo;{turn.targetSentenceKo}&rdquo;
              </p>
              <div className="flex items-center justify-center gap-1.5 flex-wrap my-2">
                <span className="text-[11px] text-slate-400 font-medium">Key words:</span>
                {turn.keyWords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-lg shadow-2xs"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Audio Listen controls or [💡 Show sentence] button */}
          {!isRound3Hidden ? (
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => handlePlayAudio(turn.targetSentence, 0.9)}
                disabled={isPlayingAudio}
                className={`flex-1 min-h-[48px] h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:bg-blue-200'
                }`}
              >
                <span className="text-base">🔊</span>
                <span>Listen</span>
              </button>

              <button
                type="button"
                onClick={() => handlePlayAudio(turn.targetSentence, 0.7)}
                disabled={isPlayingAudio}
                className={`flex-1 min-h-[48px] h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 active:bg-amber-200'
                }`}
              >
                <span className="text-base">🐢</span>
                <span>Slow</span>
              </button>
            </div>
          ) : (
            <div className="w-full mt-2">
              <button
                type="button"
                onClick={() => setIsSentenceRevealed(true)}
                className="w-full min-h-[48px] h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 active:bg-amber-200 transition-colors cursor-pointer shadow-2xs"
              >
                <span className="text-base">💡</span>
                <span>Show sentence (문장 보기)</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Zone: Large Round Mic + You said + Sam Feedback + Action Buttons */}
      <div className="flex flex-col items-center gap-3">
        {/* Error message if mic permission denied */}
        {errorMessage && (
          <div className="w-full p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Large Round Mic Button */}
        <div className="flex flex-col items-center">
          <div className="relative flex items-center justify-center">
            {/* Pulsing ring when listening */}
            {micState === 'listening' && (
              <span className="absolute w-24 h-24 rounded-full bg-red-400/30 animate-ping" />
            )}

            <button
              type="button"
              onClick={handleMicTap}
              disabled={isPlayingAudio}
              className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-md transition-all duration-150 cursor-pointer select-none ${
                isPlayingAudio
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : micState === 'listening'
                  ? 'bg-red-500 text-white scale-105 ring-4 ring-red-200'
                  : micState === 'done'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
              }`}
              aria-label={
                isPlayingAudio
                  ? 'Audio playing, mic locked'
                  : micState === 'listening'
                  ? 'Stop listening'
                  : 'Tap to speak'
              }
            >
              {micState === 'done' ? (
                <span className="text-2xl font-bold">✓</span>
              ) : micState === 'listening' ? (
                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 bg-white rounded-xs mb-1" />
                  <span className="text-[10px] font-bold">Stop</span>
                </div>
              ) : (
                <span className="text-2xl">🎤</span>
              )}
            </button>
          </div>

          {/* Mic state label */}
          <span className="text-xs font-semibold mt-1.5 text-slate-600">
            {isPlayingAudio
              ? 'Audio is playing…'
              : micState === 'listening'
              ? 'Listening… (말씀해 주세요)'
              : micState === 'done'
              ? 'Done (인식 완료)'
              : 'Tap to speak (눌러서 말하기)'}
          </span>
        </div>

        {/* "You said: …" text */}
        <div className="w-full bg-slate-100/80 rounded-xl px-3.5 py-2 text-center min-h-[38px] flex items-center justify-center border border-slate-200/60">
          <p className="text-xs text-slate-700 leading-snug">
            <span className="font-semibold text-slate-500">You said: </span>
            {micState === 'listening' ? (
              <span className="italic text-slate-500">
                {transcript || '…listening…'}
              </span>
            ) : lastUserSaid ? (
              <span className="font-medium text-slate-900">
                &ldquo;{lastUserSaid}&rdquo;
              </span>
            ) : (
              <span className="text-slate-400 italic">
                (Tap mic and speak)
              </span>
            )}
          </p>
        </div>

        {/* Feedback box from Sam (Section 7) with soft colors */}
        {feedback && (
          <div
            className={`w-full rounded-2xl p-3.5 border transition-all ${
              feedback.type === 'success'
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/90 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <SamAvatar size={28} />
              <div className="flex-1 text-xs">
                <p className="font-semibold leading-relaxed">
                  {feedback.messageEn}
                </p>
                <p className="text-slate-600 mt-1 font-medium">
                  ({feedback.messageKo})
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Consecutive no-speech hint card (2 times in a row) */}
        {consecutiveNoSpeechCount >= 2 && (
          <div className="w-full rounded-2xl p-3.5 bg-amber-50/90 border border-amber-200 text-amber-950 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <span>💡</span>
                <span>Hint (힌트)</span>
              </span>
              <button
                type="button"
                onClick={() => handlePlayAudio(turn.targetSentence, 0.9)}
                disabled={isPlayingAudio}
                className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-900 rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
              >
                <span>🔊</span>
                <span>Listen</span>
              </button>
            </div>
            <p className="font-semibold text-slate-800 text-[13px] my-1">
              &ldquo;{turn.chunk1}&rdquo; … &ldquo;{turn.chunk2}&rdquo;
            </p>
            <p className="text-amber-800 font-medium text-[11px] mt-1">
              Try speaking a little louder and closer to the mic. (마이크에 조금 더 가까이, 조금 더 크게 말해 봐요.)
            </p>
          </div>
        )}

        {/* Action Buttons: [Try Again] [Next →] [Skip] */}
        <div className="grid grid-cols-3 gap-2 w-full pt-1">
          {/* Try Again */}
          <button
            type="button"
            onClick={handleTryAgain}
            className="min-h-[48px] h-12 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span>🔁</span>
            <span>Try Again</span>
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={handleNextClick}
            className={`min-h-[48px] h-12 font-semibold text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1 cursor-pointer transition-colors ${
              feedback?.isSuccess
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm ring-2 ring-blue-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
            }`}
          >
            <span>Next →</span>
          </button>

          {/* Skip */}
          <button
            type="button"
            onClick={handleSkipClick}
            className="min-h-[48px] h-12 bg-white hover:bg-slate-50 text-slate-500 font-medium text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
          >
            <span>↷</span>
            <span>Skip</span>
          </button>
        </div>
      </div>
    </div>
  );
};
