import {
  PracticeTurn,
  FeedbackInfo,
  TurnRecord,
  TurnResult,
  RoundSummary,
  Improvement,
} from '../types';

/**
 * Normalizes input text by removing punctuation and converting to lowercase words array.
 */
export function extractWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 0);
}

/**
 * Checks if a key word (or one of its accepted forms, e.g. backpack/bag, thank/thanks) was said.
 */
function wordMatches(targetWord: string, candidateWords: string[], turn: PracticeTurn): boolean {
  const t = targetWord.toLowerCase();
  const accepted = [t, ...(turn.keyWordAliases?.[t] ?? turn.keyWordAliases?.[targetWord] ?? [])];
  return candidateWords.some((c) => accepted.includes(c));
}

/**
 * Key words the student did not say, in sentence order.
 */
export function findMissingKeyWords(transcript: string, turn: PracticeTurn): string[] {
  const studentWords = extractWords(transcript);
  return turn.keyWords.filter((kw) => !wordMatches(kw, studentWords, turn));
}

/**
 * ✓ first try · 💪 said after help · ↷ skipped
 */
export function getTurnResult(record: TurnRecord): TurnResult {
  if (record.status === 'skipped') return 'skipped';
  return record.tries === 0 ? 'first_try' : 'with_help';
}

export function summarizeRound(records: TurnRecord[]): RoundSummary {
  const results = records.map(getTurnResult);
  return {
    firstTry: results.filter((r) => r === 'first_try').length,
    withHelp: results.filter((r) => r === 'with_help').length,
    skipped: results.filter((r) => r === 'skipped').length,
  };
}

/**
 * One positive line comparing this round with an earlier one, or null when nothing got better.
 * Never reports a drop.
 */
export function describeImprovement(
  current: RoundSummary,
  previous: RoundSummary | undefined,
  compareTo: { en: string; ko: string }
): Improvement | null {
  if (!previous) return null;
  const fewerSkips = previous.skipped - current.skipped;
  if (fewerSkips > 0) {
    return {
      en: `${fewerSkips} fewer skipped ${fewerSkips === 1 ? 'sentence' : 'sentences'} than ${compareTo.en}!`,
      ko: `${compareTo.ko}보다 건너뛴 문장이 ${fewerSkips}개 줄었어요!`,
    };
  }
  const moreFirstTry = current.firstTry - previous.firstTry;
  if (moreFirstTry > 0) {
    return {
      en: `${moreFirstTry} more ${moreFirstTry === 1 ? 'sentence' : 'sentences'} on the first try than ${compareTo.en}!`,
      ko: `${compareTo.ko}보다 한 번에 말한 문장이 ${moreFirstTry}개 늘었어요!`,
    };
  }
  return null;
}

/**
 * Replaces key words in the target sentence with underscores corresponding to word length.
 */
export function getSentenceWithGaps(targetSentence: string, keyWords: string[]): string {
  let result = targetSentence;
  for (const kw of keyWords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    result = result.replace(regex, (match) => '_'.repeat(match.length));
  }
  return result;
}

export function evaluateSpeech(
  transcript: string,
  turn: PracticeTurn,
  currentTryCount: number
): FeedbackInfo {
  const trimmed = transcript.trim();
  if (!trimmed) {
    return {
      type: 'no_speech',
      messageEn: "Sorry, I didn't catch that. Can you say it again?",
      messageKo: '잘 못 들었어요. 한 번 더 말해 줄래요?',
      isSuccess: false,
    };
  }

  const studentWords = extractWords(trimmed);

  // Check key words
  const missingKeyWords = findMissingKeyWords(trimmed, turn);

  // If ALL key words are present, it is a SUCCESS!
  if (missingKeyWords.length === 0) {
    // Check if any small word is missing
    const missingSmallWords = turn.smallWords.filter(
      (sw) => !studentWords.includes(sw.toLowerCase())
    );

    if (missingSmallWords.length > 0) {
      // Pick the most illustrative missing small word (e.g. 'is', 'my', etc.)
      const priorityOrder = ['is', 'my', 'in', 'it', 'a', 'the', 'can', 'you', 'so'];
      const chosenMissing =
        priorityOrder.find((p) => missingSmallWords.includes(p)) || missingSmallWords[0];

      return {
        type: 'success_missing_small',
        messageEn: `Great, I understood you! Try it with "${chosenMissing}": "${turn.targetSentence}"`,
        messageKo: `"${chosenMissing}"를 넣어서 말해 볼까요?`,
        isSuccess: true,
      };
    }

    return {
      type: 'success',
      messageEn: 'Great! I understood you clearly.',
      messageKo: '잘 알아들었어요!',
      isSuccess: true,
    };
  }

  // Not all key words present -> Failed attempt
  const attempt = currentTryCount; // 1 for first failure, 2 for second, 3+ for third

  if (attempt <= 1) {
    // 1st failure (recast)
    return {
      type: 'recast',
      messageEn: `Nice try! You can say, "${turn.targetSentence}"`,
      messageKo: '이렇게 말해 볼까요?',
      isSuccess: false,
    };
  }

  if (attempt === 2) {
    // 2nd failure (elicitation: first-letter hint for first missing key word)
    const firstMissing = missingKeyWords[0];
    const clue = turn.getKeyWordClue(firstMissing);
    return {
      type: 'elicitation',
      messageEn: `You're almost there! "${clue.hintSentence}"`,
      messageKo: clue.hintKo,
      isSuccess: false,
    };
  }

  // 3rd failure and above (chunking)
  return {
    type: 'chunking',
    messageEn: `Let's say it in two parts: "${turn.chunk1}" … "${turn.chunk2}"`,
    messageKo: '두 부분으로 나눠서 따라 해 봐요.',
    isSuccess: false,
  };
}
