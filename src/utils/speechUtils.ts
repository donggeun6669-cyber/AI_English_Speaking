// Utility for browser capability and environment detection

export function detectInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  return /KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER|Snapchat|Whale/i.test(ua);
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

// Natural-sounding US English voices, best first (macOS/iOS, Chrome, Windows/Edge, Android)
const PREFERRED_VOICES = [
  'Samantha',
  'Google US English',
  'Microsoft Aria Online (Natural)',
  'Microsoft Jenny Online (Natural)',
  'Microsoft Ava Online (Natural)',
  'Ava',
  'Allison',
  'Susan',
  'Nicky',
  'Microsoft Zira',
];

// macOS/iOS novelty and robotic voices (e.g. "Albert" sounds like an old man). Never use these.
const NOVELTY_VOICES = [
  'Albert', 'Bad News', 'Bahh', 'Bells', 'Boing', 'Bubbles', 'Cellos', 'Deranged',
  'Good News', 'Hysterical', 'Jester', 'Organ', 'Pipe Organ', 'Superstar', 'Trinoids',
  'Whisper', 'Wobble', 'Zarvox', 'Fred', 'Junior', 'Kathy', 'Ralph', 'Princess',
  'Grandma', 'Grandpa', 'Eddy', 'Flo', 'Reed', 'Rocko', 'Sandy', 'Shelley',
];

function isNovelty(voice: SpeechSynthesisVoice): boolean {
  return NOVELTY_VOICES.some((n) => voice.name === n || voice.name.startsWith(`${n} (`));
}

/**
 * Picks one natural US English voice. Returns null when no voice list is available yet.
 */
export function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const usable = voices.filter((v) => v.lang.replace('_', '-').startsWith('en') && !isNovelty(v));
  for (const name of PREFERRED_VOICES) {
    const found = usable.find(
      (v) => v.lang.replace('_', '-') === 'en-US' && (v.name === name || v.name.startsWith(name))
    );
    if (found) return found;
  }
  return (
    usable.find((v) => v.lang.replace('_', '-') === 'en-US') ||
    usable[0] ||
    null
  );
}

/**
 * Starts loading the voice list early so the first auto-played question uses the right voice.
 */
export function preloadVoices(): void {
  if (!isSpeechSynthesisSupported()) return;
  window.speechSynthesis.getVoices();
}

/**
 * Text-to-speech helper with cancel support
 */
export function playTextToSpeech(
  text: string,
  rate = 0.9,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (err: unknown) => void
): () => void {
  if (!isSpeechSynthesisSupported()) {
    onEnd?.();
    return () => {};
  }

  let cancelled = false;
  let waitTimer: ReturnType<typeof setTimeout> | null = null;
  const synth = window.speechSynthesis;

  const speak = () => {
    if (cancelled) return;
    try {
      synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate; // 0.9 normal, 0.7 slow
      utterance.pitch = 1.05; // Slightly youthful, calm friendly tone

      const voice = pickEnglishVoice(synth.getVoices());
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = (e) => {
        // If canceled, it throws an error event; treat as end
        onEnd?.();
        onError?.(e);
      };

      synth.speak(utterance);
    } catch (err) {
      onEnd?.();
      onError?.(err);
    }
  };

  // The voice list loads asynchronously; on the very first call it can still be empty,
  // which made the browser fall back to a different default voice.
  if (synth.getVoices().length > 0) {
    speak();
  } else {
    const onVoices = () => {
      synth.removeEventListener('voiceschanged', onVoices);
      if (waitTimer) clearTimeout(waitTimer);
      speak();
    };
    synth.addEventListener('voiceschanged', onVoices);
    waitTimer = setTimeout(onVoices, 1000);
  }

  return () => {
    cancelled = true;
    if (waitTimer) clearTimeout(waitTimer);
    try {
      synth.cancel();
    } catch {
      // ignore
    }
  };
}
