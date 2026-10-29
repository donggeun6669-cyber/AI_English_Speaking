import React from 'react';
import { RoundNumber } from '../types';
import { DIALOGUE_TURNS } from '../data/dialogueData';
import { SamAvatar } from './Illustrations';

interface GetReadyScreenProps {
  round: RoundNumber;
  onReady: () => void;
}

export const GetReadyScreen: React.FC<GetReadyScreenProps> = ({ round, onReady }) => {
  const getRoundInfo = (r: RoundNumber) => {
    switch (r) {
      case 1:
        return {
          title: 'Round 1: Listen & Say',
          subtitle: '듣고 따라 말하기',
          desc: '문장을 듣고 자신 있게 따라 말해 봐요.',
        };
      case 2:
        return {
          title: 'Round 2: Fill the Gaps',
          subtitle: '빈칸을 채워 말하기',
          desc: '가려진 핵심 단어를 채워서 말해 봐요.',
        };
      case 3:
        return {
          title: 'Round 3: Talk to Sam',
          subtitle: '핵심 단어로 대화하기',
          desc: '핵심 단어만 보고 Sam에게 직접 말해 봐요.',
        };
    }
  };

  const roundInfo = getRoundInfo(round);

  return (
    <div className="flex flex-col min-h-full px-5 py-5 justify-between animate-fadeIn">
      {/* Top Header */}
      <div className="text-center pt-1">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Get ready! <span className="text-lg font-bold text-slate-600">(준비해요!)</span>
        </h1>
        <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
          <span>{roundInfo.title}</span>
          <span className="text-blue-400">·</span>
          <span>{roundInfo.subtitle}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1.5">
          {roundInfo.desc}
        </p>
      </div>

      {/* 5 Small Cards (one per turn) */}
      <div className="my-auto py-3 space-y-2 max-h-[58vh] overflow-y-auto pr-0.5">
        {DIALOGUE_TURNS.map((turn, idx) => (
          <div
            key={turn.id}
            className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs text-left"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-1">
              <span className="text-blue-600 font-bold">Turn {idx + 1}</span>
              <span>Sam&apos;s Question</span>
            </div>

            <div className="flex items-start gap-2 mb-2">
              <SamAvatar size={24} />
              <p className="text-xs font-medium text-slate-800 leading-snug">
                {turn.partnerPrompt}
              </p>
            </div>

            {/* Key words as chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-medium mr-1">
                Key words:
              </span>
              {turn.keyWords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 bg-blue-50 border border-blue-200/60 rounded-md text-[11px] font-semibold text-blue-700"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Button: Large [I'm ready! 🎤] (min 48px) */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onReady}
          className="w-full min-h-[52px] h-[52px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>I&apos;m ready!</span>
          <span className="text-lg">🎤</span>
        </button>
      </div>
    </div>
  );
};
