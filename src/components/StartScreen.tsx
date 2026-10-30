import React from 'react';
import { SamAtDeskIllustration } from './Illustrations';
import { detectInAppBrowser, isSpeechRecognitionSupported } from '../utils/speechUtils';
import { LOST_ITEMS, getLostItem } from '../data/dialogueData';
import { ItemId } from '../types';

interface StartScreenProps {
  selectedItem: ItemId;
  onSelectItem: (id: ItemId) => void;
  studentCode: string;
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedItem,
  onSelectItem,
  studentCode,
  onStart,
}) => {
  const isInApp = detectInAppBrowser();
  const isSpeechSupported = isSpeechRecognitionSupported();
  const item = getLostItem(selectedItem);

  return (
    <div className="flex flex-col min-h-full px-5 py-5 justify-between animate-fadeIn">
      {/* Top Header & Illustration */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
          Found It!
        </h1>
        <p className="text-sm font-semibold text-blue-600 mt-0.5 tracking-wide">
          Lost & Found Talk
        </p>

        {/* Sam at the desk illustration */}
        <div className="w-full mt-3 mb-1">
          <SamAtDeskIllustration className="w-full h-44" />
        </div>
      </div>

      {/* Middle: Item choice + Situation Card */}
      <div className="my-auto py-2">
        <p className="text-xs font-semibold text-slate-600 mb-1.5 text-center">
          What did you lose? <span className="text-slate-400 font-medium">(무엇을 잃어버렸나요?)</span>
        </p>
        <div className="grid grid-cols-4 gap-1.5 mb-3" role="radiogroup" aria-label="Lost item">
          {LOST_ITEMS.map((option) => {
            const selected = option.id === selectedItem;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onSelectItem(option.id)}
                className={`min-h-[72px] rounded-xl border px-1 py-2 flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                  selected
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl leading-none" aria-hidden="true">{option.emoji}</span>
                <span className={`text-[11px] font-semibold leading-tight ${selected ? 'text-blue-700' : 'text-slate-700'}`}>
                  {option.labelKo}
                </span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Situation
          </p>
          <p className="text-base font-medium text-slate-800 leading-snug">
            {item.situationEn}
          </p>
          <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
            {item.situationKo}
          </p>

          {/* Clean metadata without pill badges */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
            <span>5 sentences</span>
            <span aria-hidden="true">·</span>
            <span>about 5 minutes</span>
          </div>
        </div>

        {/* Environmental Warning banners if in-app browser or unsupported */}
        {isInApp && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 leading-relaxed text-center">
            ⚠️ 카카오톡이나 인스타그램 등 인앱 브라우저에서는 마이크가 작동하지 않을 수 있습니다. Safari 또는 Chrome으로 열어 주세요.
          </div>
        )}
        {!isSpeechSupported && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 leading-relaxed text-center">
            음성 인식을 위해 크롬(Chrome) 브라우저 사용을 권장합니다.
          </div>
        )}
      </div>

      {/* Bottom: Start CTA & Notices */}
      <div className="flex flex-col gap-2.5 pt-2">
        {/* Large Start Button (min 48px) */}
        <button
          onClick={onStart}
          type="button"
          className="w-full min-h-[52px] h-[52px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-lg rounded-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>▶</span>
          <span>Start</span>
        </button>

        {/* Mic guide */}
        <div className="text-center px-2">
          <p className="text-xs font-medium text-slate-600">
            When asked, tap &lsquo;Allow&rsquo; for the microphone.
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            (마이크 허용을 눌러 주세요.)
          </p>
        </div>

        {/* Practice code: shown to the teacher instead of a name */}
        <div className="text-center bg-slate-100/80 border border-slate-200/70 rounded-xl px-3 py-2">
          <p className="text-xs text-slate-600">
            My practice code: <span className="font-bold text-slate-900">{studentCode}</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            (선생님께 이 코드를 알려 주세요. 이름은 저장하지 않아요.)
          </p>
        </div>

        {/* Privacy notice */}
        <p className="text-[11px] text-slate-400 text-center leading-normal px-2 pb-1">
          Your voice is processed to turn it into text and is not recorded or saved.
          Only your practice results are saved, with this code instead of your name.
        </p>
      </div>
    </div>
  );
};
