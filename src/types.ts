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
  getKeyWordClue: (missingKeyWord: string) => { hintSentence: string; hintKo: string };
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
  tries: number;
  lastTranscript?: string;
}
