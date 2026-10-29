import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { GetReadyScreen } from './components/GetReadyScreen';
import { PracticeScreen } from './components/PracticeScreen';
import { ResultScreen } from './components/ResultScreen';
import { DIALOGUE_TURNS } from './data/dialogueData';
import { TurnRecord, RoundNumber } from './types';

type ScreenType = 'start' | 'get_ready' | 'practice' | 'result';

export default function App() {
  const [screen, setScreen] = useState<ScreenType>('start');
  const [round, setRound] = useState<RoundNumber>(1);
  const [currentTurnIndex, setCurrentTurnIndex] = useState<number>(0);
  const [records, setRecords] = useState<TurnRecord[]>([]);

  // Start button on Start Screen: resets to Round 1 and opens Get Ready
  const handleStart = () => {
    setRound(1);
    setRecords([]);
    setCurrentTurnIndex(0);
    setScreen('get_ready');
  };

  // Ready button on Get Ready Screen: opens Practice Screen
  const handleReady = () => {
    setScreen('practice');
  };

  // Next turn in Practice Screen
  const handleNextTurn = (record: TurnRecord) => {
    const updated = [...records, record];
    setRecords(updated);

    if (currentTurnIndex + 1 < DIALOGUE_TURNS.length) {
      setCurrentTurnIndex(currentTurnIndex + 1);
    } else {
      setScreen('result');
    }
  };

  // Skip turn in Practice Screen
  const handleSkipTurn = (record: TurnRecord) => {
    const updated = [...records, record];
    setRecords(updated);

    if (currentTurnIndex + 1 < DIALOGUE_TURNS.length) {
      setCurrentTurnIndex(currentTurnIndex + 1);
    } else {
      setScreen('result');
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
    setScreen('start');
  };

  return (
    <div className="min-h-screen w-full bg-[#EFF3F8] text-slate-900 flex justify-center items-center sm:p-4 font-sans select-none antialiased">
      {/* Mobile-first portrait phone container (max-width 480px) */}
      <main className="w-full max-w-[480px] min-h-screen sm:min-h-[720px] sm:max-h-[860px] sm:h-[90vh] bg-slate-50 sm:rounded-3xl sm:shadow-xl sm:border sm:border-slate-200/90 flex flex-col overflow-hidden relative">
        {screen === 'start' && <StartScreen onStart={handleStart} />}

        {screen === 'get_ready' && (
          <GetReadyScreen
            round={round}
            onReady={handleReady}
          />
        )}

        {screen === 'practice' && (
          <PracticeScreen
            key={`${round}-${currentTurnIndex}`}
            turn={DIALOGUE_TURNS[currentTurnIndex]}
            turnIndex={currentTurnIndex}
            totalTurns={DIALOGUE_TURNS.length}
            round={round}
            onNextTurn={handleNextTurn}
            onSkipTurn={handleSkipTurn}
          />
        )}

        {screen === 'result' && (
          <ResultScreen
            round={round}
            records={records}
            onNextRound={round < 3 ? handleNextRound : undefined}
            onPracticeAgain={handlePracticeAgain}
            onHome={handleHome}
          />
        )}
      </main>
    </div>
  );
}
