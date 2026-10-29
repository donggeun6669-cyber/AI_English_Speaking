import React from 'react';
import { SamAtDeskIllustration } from './Illustrations';
import { detectInAppBrowser, isSpeechRecognitionSupported } from '../utils/speechUtils';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const isInApp = detectInAppBrowser();
  const isSpeechSupported = isSpeechRecognitionSupported();

  return (
    <div className="flex flex-col min-h-full px-5 py-6 justify-between animate-fadeIn">
      {/* Top Header & Illustration */}
      <div className="flex flex-col items-center text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
          Found It!
        </h1>
        <p className="text-sm font-semibold text-blue-600 mt-0.5 tracking-wide">
          Lost & Found Talk
        </p>

        {/* Sam at the desk illustration */}
        <div className="w-full mt-4 mb-2">
          <SamAtDeskIllustration className="w-full h-56" />
        </div>
      </div>

      {/* Middle: Situation Card */}
      <div className="my-auto py-2">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Situation
          </p>
          <p className="text-base font-medium text-slate-800 leading-snug">
            You lost your bag at school. Ask Sam at the lost-and-found desk for help.
          </p>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            학교에서 가방을 잃어버렸어요. 분실물 센터의 Sam에게 도움을 청해 보세요.
          </p>

          {/* Clean metadata without pill badges */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
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
      <div className="flex flex-col gap-3 pt-3">
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

        {/* Privacy notice */}
        <p className="text-[11px] text-slate-400 text-center leading-normal px-2 pb-1">
          Your voice is processed to turn it into text and is not recorded or saved.
        </p>
      </div>
    </div>
  );
};
