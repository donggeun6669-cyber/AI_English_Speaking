import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { GetReadyScreen } from './components/GetReadyScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { ResultScreen } from './components/ResultScreen';
import { getLostItem } from './data/dialogueData';
import { TurnRecord, RoundNumber, ItemId, RoundSummary, Improvement } from './types';
import { describeImprovement, summarizeRound } from './utils/feedbackEngine';
import {
  countStars,
  getLastResult,
  getStudentCode,
  saveResult,
  sendToTeacherSheet,
  todayString,
} from './utils/progress';

type ScreenType = 'start' | 'get_ready' | 'practice' | 'result';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('start');
  const [itemId, setItemId] = useState<ItemId>('bag');
  const [round, setRound] = useState<RoundNumber>(1);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [records, setRecords] = useState<TurnRecord[]>([]);
  // Results of each round in this visit (for "better than Round 1")
  const [sessionSummaries, setSessionSummaries] = useState<Partial<Record<RoundNumber, RoundSummary>>>({});
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [studentCode] = useState<string>(() => getStudentCode());

  const item = getLostItem(itemId);
  const turns = item.turns;

  // Start button on Start Screen: resets to Round 1 and opens Get Ready
  const handleStart = () => {
    setRound(1);
    setRecords([]);
    setCurrentTurnIndex(0);
    setSessionSummaries({});
    setScreen('get_ready');
  };

  // Ready button on Get Ready Screen: opens Practice Screen
  const handleReady = () => {
    setScreen('practice');
  };

  // Last turn finished: compare, save on this phone, send to the teacher sheet
  const finishRound = (finalRecords: TurnRecord[]) => {
    const summary = summarizeRound(finalRecords);

    const found: Improvement[] = [];
    if (round > 1) {
      const prevRound = (round - 1) as RoundNumber;
      const vsRound = describeImprovement(summary, sessionSummaries[prevRound], {
        en: `Round ${prevRound}`,
        ko: `${prevRound}라운드`,
      });
      if (vsRound) found.push(vsRound);
    }
    const last = getLastResult(itemId, round);
    if (last) {
      const vsLast = describeImprovement(summary, last.summary, {
        en: 'last time',
        ko: last.date === todayString() ? '아까' : '지난번',
      });
      if (vsLast) found.push(vsLast);
    }
    setImprovements(found);

    setSessionSummaries({ ...sessionSummaries, [round]: summary });
    saveResult({ date: todayString(), item: itemId, round, summary });
    sendToTeacherSheet({
      code: studentCode,
      item: itemId,
      round,
      records: finalRecords,
      summary,
      stars: countStars(summary.skipped),
    });

    setScreen('result');
  };

  // Next or Skip in Practice Screen
  const handleTurnDone = (record: TurnRecord) => {
    const updated = [...records, record];
    setRecords(updated);

    if (currentTurnIndex + 1 < turns.length) {
      setCurrentTurnIndex(currentTurnIndex + 1);
    } else {
      finishRound(updated);
    }
  };

  // Proceed to next round (Round 1 -> 2, Round 2 -> 3)
  const handleNextRound = () => {
    if (round < 3) {
      const nextR = (round + 1) as RoundNumber;
      setRound(nextR);
      setRecords([]);
      setCurrentTurnIndex(0);
      setScreen('get_ready');
    }
  };

  // Practice Again (same round)
  const handlePracticeAgain = () => {
    setRecords([]);
    setCurrentTurnIndex(0);
    setScreen('get_ready');
  };

  // Return to Home: back to Start Screen and reset to Round 1
  const handleHome = () => {
    setRound(1);
    setRecords([]);
    setCurrentTurnIndex(0);
    setSessionSummaries({});
    setScreen('start');
  };

  return (
    <div className="min-h-screen w-full bg-[#EFF3F8] text-slate-900 flex justify-center items-center sm:p-4 font-sans select-none antialiased">
      {/* Mobile-first portrait phone container (max-width 480px) */}
      <main className="w-full max-w-[480px] min-h-screen sm:min-h-[720px] sm:max-h-[860px] sm:h-[90vh] bg-slate-50 sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-200/90 flex flex-col overflow-hidden relative">
        {screen === 'start' && (
          <StartScreen
            selectedItem={itemId}
            onSelectItem={setItemId}
            studentCode={studentCode}
            onStart={handleStart}
          />
        )}

        {screen === 'get_ready' && (
          <GetReadyScreen
            round={round}
            turns={turns}
            onReady={handleReady}
          />
        )}

        {screen === 'practice' && (
          <PracticeScreen
            key={`${itemId}-${round}-${currentTurnIndex}`}
            turn={turns[currentTurnIndex]}
            turnIndex={currentTurnIndex}
            totalTurns={turns.length}
            round={round}
            onNextTurn={handleTurnDone}
            onSkipTurn={handleTurnDone}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            item={item}
            round={round}
            records={records}
            improvements={improvements}
            onNextRound={round < 3 ? handleNextRound : undefined}
            onPracticeAgain={handlePracticeAgain}
            onHome={handleHome}
          />
        )}
      </main>
    </div>
  );
}
