export interface PracticeTurn {
  id: number;
  partnerPrompt: string;
  partnerPromptKo: string;
  targetSentence: string;
  targetSentenceKo: string;
  keyWords: string[];
  smallWords: string[];
  chunk1: string;
  chunk2: string;
  /** Other forms that also count as a key word (e.g. backpack: bag, pack) */
  keyWordAliases?: Record<string, string[]>;
  getKeyWordClue: (missingKeyWord: string) => { hintSentence: string; hintKo: string };
}

export type ItemId = 'bag' | 'bottle' | 'pencil_case' | 'umbrella';

export interface LostItem {
  id: ItemId;
  emoji: string;
  labelEn: string;
  labelKo: string;
  situationEn: string;
  situationKo: string;
  foundKo: string;
  /** Sam handing the item back (Result Screen) */
  resultImage: string;
  resultAlt: string;
  turns: PracticeTurn[];
}

export type RoundNumber = 1 | 2 | 3;

export type MicState = 'ready' | 'listening' | 'done';

export interface FeedbackInfo {
  type: 'success' | 'success_missing_small' | 'recast' | 'elicitation' | 'chunking' | 'no_speech';
  messageEn: string;
  messageKo: string;
  isSuccess: boolean;
}

export interface TurnRecord {
  turnId: number;
  targetSentence: string;
  targetSentenceKo: string;
  status: 'said' | 'skipped';
  /** Failed tries on this turn (no-speech is not counted) */
  tries: number;
  lastTranscript?: string;
}

/** ✓ said on the first try · 💪 said after help · ↷ skipped */
export type TurnResult = 'first_try' | 'with_help' | 'skipped';

export interface RoundSummary {
  firstTry: number;
  withHelp: number;
  skipped: number;
}

export interface Improvement {
  en: string;
  ko: string;
}
