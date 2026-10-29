import { useState, useRef, useCallback, useEffect } from 'react';
import { MicState } from '../types';
import { isSpeechRecognitionSupported } from '../utils/speechUtils';

// Web Speech API interface definitions for TypeScript
interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionResult {
  0: SpeechRecognitionResultItem;
  length: number;
  isFinal: boolean;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}
interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onspeechstart?: (() => void) | null;
  onspeechend?: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

interface UseSpeechRecognitionProps {
  onFinalResult: (transcript: string) => void;
}

export function useSpeechRecognition({ onFinalResult }: UseSpeechRecognitionProps) {
  const [micState, setMicState] = useState<MicState>('ready');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTranscriptRef = useRef<string>('');
  const isManuallyStoppedRef = useRef<boolean>(false);

  // Clear silence timer
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  // Finish recognition and emit final result
  const finishRecognition = useCallback(
    (finalText: string) => {
      clearSilenceTimer();
      setMicState('done');
      const textToEmit = finalText.trim();
      setTranscript(textToEmit);
      onFinalResult(textToEmit);
    },
    [clearSilenceTimer, onFinalResult]
  );

  const stopListening = useCallback(() => {
    clearSilenceTimer();
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, [clearSilenceTimer]);

  const startListening = useCallback(() => {
    setErrorMessage(null);

    if (!isSpeechRecognitionSupported()) {
      setErrorMessage('Please open it in Chrome. (크롬 브라우저에서 열어 주세요.)');
      return;
    }

    // Reset previous
    clearSilenceTimer();
    currentTranscriptRef.current = '';
    setTranscript('');
    isManuallyStoppedRef.current = false;

    try {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) {
        setErrorMessage('Please open it in Chrome. (크롬 브라우저에서 열어 주세요.)');
        return;
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setMicState('listening');
        // Set an initial safety timer of 8 seconds if no speech occurs at all
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 8000);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let combined = '';
        for (let i = 0; i < event.results.length; i++) {
          combined += event.results[i][0].transcript + ' ';
        }
        const cleaned = combined.trim();
        currentTranscriptRef.current = cleaned;
        setTranscript(cleaned);

        // Reset silence timer: stop after ~1.5s of silence after speech is detected
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 1500);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        clearSilenceTimer();
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setErrorMessage(
            'Microphone permission is required. Please check your browser settings. (마이크 권한을 허용해 주세요.)'
          );
        } else if (event.error === 'no-speech') {
          // Handled gracefully in onend
        } else {
          // Other transient errors
        }
      };

      recognition.onend = () => {
        clearSilenceTimer();
        finishRecognition(currentTranscriptRef.current);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setMicState('ready');
      setErrorMessage(
        'Microphone permission is required. Please check your browser settings. (마이크 권한을 허용해 주세요.)'
      );
    }
  }, [clearSilenceTimer, finishRecognition, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [clearSilenceTimer]);

  const resetMic = useCallback(() => {
    clearSilenceTimer();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
    }
    setMicState('ready');
    setTranscript('');
    setErrorMessage(null);
    currentTranscriptRef.current = '';
  }, [clearSilenceTimer]);

  return {
    micState,
    transcript,
    errorMessage,
    startListening,
    stopListening,
    resetMic,
    setDirectTranscript: (text: string) => {
      currentTranscriptRef.current = text;
      finishRecognition(text);
    },
  };
}
