import { PracticeTurn, FeedbackInfo } from '../types';

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
 * Checks if a word is contained in a word list, with slight tolerance for endings (e.g. plurals or ing).
 */
function wordMatches(targetWord: string, candidateWords: string[]): boolean {
  const t = targetWord.toLowerCase();
  for (const c of candidateWords) {
    if (c === t) return true;
    // Simple tolerance for speech recognition variations (e.g. backpack/backpacks, thank/thanks)
    if (t === 'backpack' && (c === 'backpacks' || c === 'bag' || c === 'pack')) return true;
    if (t === 'thank' && (c === 'thanks' || c === 'thanked')) return true;
    if (t === 'help' && (c === 'helping' || c === 'helps')) return true;
    if (t === 'book' && c === 'books') return true;
  }
  return false;
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
  const missingKeyWords = turn.keyWords.filter(
    (kw) => !wordMatches(kw, studentWords)
  );

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
