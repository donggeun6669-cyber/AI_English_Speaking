import React from 'react';
import { TurnRecord, RoundNumber } from '../types';
import { SamHandingBagIllustration, SamAvatar } from './Illustrations';

interface ResultScreenProps {
  round: RoundNumber;
  records: TurnRecord[];
  onNextRound?: () => void;
  onPracticeAgain: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  round,
  records,
  onNextRound,
  onPracticeAgain,
  onHome,
}) => {
  // Calculate star rules from Section 6:
  // ⭐⭐⭐ Said all 5 sentences without skipping (any number of tries)
  // ⭐⭐ Skipped 1–2 sentences
  // ⭐ Finished the whole dialogue
  const skippedCount = records.filter((r) => r.status === 'skipped').length;

  let starDisplay = '⭐⭐⭐';
  let starLabel = 'Said all 5 sentences!';
  if (skippedCount === 0) {
    starDisplay = '⭐⭐⭐';
    starLabel = 'Said all 5 sentences!';
  } else if (skippedCount <= 2) {
    starDisplay = '⭐⭐';
    starLabel = 'Finished with great effort!';
  } else {
    starDisplay = '⭐';
    starLabel = 'Completed the whole dialogue!';
  }

  // Section 3: One thing you did well + one next challenge
  const didWell =
    skippedCount === 0
      ? {
          en: 'You asked for help in all 5 turns!',
          ko: '5번 모두 도움을 청했어요!',
        }
      : {
          en: 'You finished the whole talk with Sam!',
          ko: 'Sam과 대화를 끝까지 마쳤어요!',
        };

  let nextChallenge = { en: '', ko: '' };
  if (round === 1) {
    nextChallenge = {
      en: 'Next challenge: Round 2 — say it with some words hidden!',
      ko: '다음 도전: 단어가 가려진 2라운드!',
    };
  } else if (round === 2) {
    nextChallenge = {
      en: 'Next challenge: Round 3 — answer Sam with only the key words!',
      ko: '다음 도전: 핵심 단어만 보고 말하는 3라운드!',
    };
  } else {
    // Round 3
    if (skippedCount > 0) {
      nextChallenge = {
        en: 'Next challenge: say the skipped sentences, too!',
        ko: '다음 도전: 건너뛴 문장도 말해 봐요!',
      };
    } else {
      nextChallenge = {
        en: 'Next challenge: try Round 3 without the 💡 button!',
        ko: '다음 도전: 💡 없이 3라운드!',
      };
    }
  }

  return (
    <div className="flex flex-col min-h-full px-5 py-5 justify-between animate-fadeIn">
      {/* Top: Round tag + "You found it!" + Illustration + Stars */}
      <div className="flex flex-col items-center text-center">
        <span className="text-[11px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 mt-1">
          Round {round} Finished
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          You found it!
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          가방을 찾았어요!
        </p>

        {/* Sam handing back the blue bag illustration */}
        <div className="w-full mt-1 mb-1">
          <SamHandingBagIllustration className="w-full h-40" />
        </div>

        {/* Stars */}
        <div className="flex flex-col items-center">
          <div className="text-2xl tracking-widest select-none" aria-label={`Rating: ${starDisplay}`}>
            {starDisplay}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-0.5">
            {starLabel}
          </span>
        </div>
      </div>

      {/* Middle: Sam's Praise & Next Challenge + List of 5 sentences */}
      <div className="my-auto py-2">
        {/* Sam's Praise: one thing you did well + one next challenge */}
        <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-3 mb-2.5 flex items-start gap-2.5">
          <SamAvatar size={32} />
          <div className="text-xs space-y-1.5 flex-1">
            <div>
              <p className="font-bold text-blue-900 leading-snug">
                {didWell.en}
              </p>
              <p className="text-blue-700/90 font-medium text-[11px]">
                ({didWell.ko})
              </p>
            </div>
            <div className="pt-1.5 border-t border-blue-200/70">
              <p className="font-semibold text-slate-800 leading-snug">
                {nextChallenge.en}
              </p>
              <p className="text-slate-600 font-medium text-[11px]">
                ({nextChallenge.ko})
              </p>
            </div>
          </div>
        </div>

        {/* Sentence List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {records.map((item, idx) => (
            <div key={item.turnId} className="px-3 py-2 flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <span>Sentence {idx + 1}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                  &ldquo;{item.targetSentence}&rdquo;
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.targetSentenceKo}
                </p>
              </div>

              {/* Status Mark: ✓ Said or ↷ Skipped (no scores or %) */}
              <div className="shrink-0 flex items-center pt-1">
                {item.status === 'said' ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <span>✓</span>
                    <span>Said</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    <span>↷</span>
                    <span>Skipped</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        {/* Next Round Button if Round 1 or 2 */}
        {round < 3 && onNextRound && (
          <button
            type="button"
            onClick={onNextRound}
            className="w-full min-h-[48px] h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Next: Round {round + 1} →</span>
          </button>
        )}

        {/* Practice Again button */}
        <button
          type="button"
          onClick={onPracticeAgain}
          className={`w-full min-h-[48px] h-12 text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
            round === 3
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold shadow-xs'
              : 'bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium border border-slate-200'
          }`}
        >
          <span>🔁</span>
          <span>Practice Again (Round {round})</span>
        </button>

        {/* Home Button: resets to Round 1 */}
        <button
          type="button"
          onClick={onHome}
          className="w-full min-h-[44px] h-11 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>🏠</span>
          <span>Home (처음으로)</span>
        </button>
      </div>
    </div>
  );
};
