import { ItemId, LostItem, PracticeTurn } from '../types';

/**
 * First-letter hint for the first missing key word, e.g. "It is a blue b___."
 */
function makeClue(sentence: string, hintKoByKeyWord: Record<string, string>) {
  return (missing: string) => {
    const lower = missing.toLowerCase();
    const first = missing.charAt(0);
    return {
      hintSentence: sentence.replace(new RegExp(`\\b${missing}\\b`, 'i'), `${first}___`),
      hintKo: hintKoByKeyWord[lower] ?? `${missing}는 ${first.toUpperCase()}로 시작해요.`,
    };
  };
}

const COMMON_ALIASES: Record<string, string[]> = {
  help: ['helping', 'helps'],
  thank: ['thanks', 'thanked'],
};

/** Turn 1 — the same for every item */
function lostTurn(
  itemWord: string,
  itemKo: string,
  keyWord: string,
  aliases: string[],
  keyWordHintKo: string
): PracticeTurn {
  const sentence = `I lost my ${itemWord}. Can you help me?`;
  return {
    id: 1,
    partnerPrompt: 'Hi! This is the lost-and-found desk. What brings you here?',
    partnerPromptKo: '안녕하세요! 분실물 센터예요. 무슨 일로 오셨나요?',
    targetSentence: sentence,
    targetSentenceKo: `${itemKo}을 잃어버렸어요. 도와줄 수 있어요?`,
    keyWords: ['lost', keyWord, 'help'],
    smallWords: ['i', 'my', ...itemWord.split(' ').filter((w) => w !== keyWord), 'can', 'you', 'me'],
    chunk1: `I lost my ${itemWord}.`,
    chunk2: 'Can you help me?',
    keyWordAliases: { ...COMMON_ALIASES, [keyWord]: aliases },
    getKeyWordClue: makeClue(sentence, {
      lost: 'lost는 l로 시작해요.',
      [keyWord]: keyWordHintKo,
      help: 'help는 h로 시작해요.',
    }),
  };
}

/** Turn 5 — the same for every item */
function thanksTurn(itemWord: string, itemKo: string): PracticeTurn {
  const sentence = 'Yes, it is! Thank you so much!';
  return {
    id: 5,
    partnerPrompt: `Is this your ${itemWord}?`,
    partnerPromptKo: `이게 당신의 ${itemKo}인가요?`,
    targetSentence: sentence,
    targetSentenceKo: '네, 맞아요! 정말 고마워요!',
    keyWords: ['yes', 'thank'],
    smallWords: ['it', 'is', 'you', 'so', 'much'],
    chunk1: 'Yes, it is!',
    chunk2: 'Thank you so much!',
    keyWordAliases: COMMON_ALIASES,
    getKeyWordClue: makeClue(sentence, {
      yes: '시작은 Y로 시작해요.',
      thank: '감사는 T로 시작해요.',
    }),
  };
}

const DESCRIBE_PROMPT = 'Sure! What does it look like?';
const DESCRIBE_PROMPT_KO = '물론이죠! 어떻게 생겼나요?';
const WHERE_PROMPT = 'Where did you leave it?';
const WHERE_PROMPT_KO = '어디에 두고 오셨나요?';

export const LOST_ITEMS: LostItem[] = [
  {
    id: 'bag',
    emoji: '🎒',
    labelEn: 'Blue backpack',
    labelKo: '파란 책가방',
    situationEn: 'You lost your bag at school. Ask Sam at the lost-and-found desk for help.',
    situationKo: '학교에서 가방을 잃어버렸어요. 분실물 센터의 Sam에게 도움을 청해 보세요.',
    foundKo: '가방을 찾았어요!',
    resultImage: '/images/sam-bag.jpg',
    resultAlt: 'Sam happily handing back the blue backpack',
    turns: [
      lostTurn('bag', '가방', 'bag', ['bags', 'backpack'], 'bag은 b로 시작해요.'),
      {
        id: 2,
        partnerPrompt: DESCRIBE_PROMPT,
        partnerPromptKo: DESCRIBE_PROMPT_KO,
        targetSentence: 'It is a blue backpack.',
        targetSentenceKo: '파란색 책가방이에요.',
        keyWords: ['blue', 'backpack'],
        smallWords: ['it', 'is', 'a'],
        chunk1: 'It is a blue',
        chunk2: 'backpack.',
        keyWordAliases: { backpack: ['backpacks', 'bag', 'pack'] },
        getKeyWordClue: makeClue('It is a blue backpack.', {
          blue: '색깔은 b로 시작해요.',
          backpack: '마지막 단어는 b로 시작해요.',
        }),
      },
      {
        id: 3,
        partnerPrompt: WHERE_PROMPT,
        partnerPromptKo: WHERE_PROMPT_KO,
        targetSentence: 'I left it in the library.',
        targetSentenceKo: '도서관에 두고 왔어요.',
        keyWords: ['left', 'library'],
        smallWords: ['i', 'it', 'in', 'the'],
        chunk1: 'I left it',
        chunk2: 'in the library.',
        getKeyWordClue: makeClue('I left it in the library.', {
          left: 'left는 l로 시작해요.',
          library: '장소는 l로 시작해요.',
        }),
      },
      {
        id: 4,
        partnerPrompt: 'Okay. What is in your bag?',
        partnerPromptKo: '알겠어요. 가방 안에 무엇이 들어있나요?',
        targetSentence: 'My English book is in it.',
        targetSentenceKo: '안에 제 영어책이 있어요.',
        keyWords: ['English', 'book'],
        smallWords: ['my', 'is', 'in', 'it'],
        chunk1: 'My English book',
        chunk2: 'is in it.',
        keyWordAliases: { book: ['books'] },
        getKeyWordClue: makeClue('My English book is in it.', {
          english: '과목은 E로 시작해요.',
          book: '물건은 b로 시작해요.',
        }),
      },
      thanksTurn('bag', '가방'),
    ],
  },
  {
    id: 'bottle',
    emoji: '💧',
    labelEn: 'Green water bottle',
    labelKo: '초록 물병',
    situationEn: 'You lost your water bottle at school. Ask Sam at the lost-and-found desk for help.',
    situationKo: '학교에서 물병을 잃어버렸어요. 분실물 센터의 Sam에게 도움을 청해 보세요.',
    foundKo: '물병을 찾았어요!',
    resultImage: '/images/sam-bottle.jpg',
    resultAlt: 'Sam happily handing back the green water bottle',
    turns: [
      lostTurn('water bottle', '물병', 'bottle', ['bottles'], '물건 이름은 b로 시작해요.'),
      {
        id: 2,
        partnerPrompt: DESCRIBE_PROMPT,
        partnerPromptKo: DESCRIBE_PROMPT_KO,
        targetSentence: 'It is a green water bottle.',
        targetSentenceKo: '초록색 물병이에요.',
        keyWords: ['green', 'bottle'],
        smallWords: ['it', 'is', 'a', 'water'],
        chunk1: 'It is a green',
        chunk2: 'water bottle.',
        keyWordAliases: { bottle: ['bottles'] },
        getKeyWordClue: makeClue('It is a green water bottle.', {
          green: '색깔은 g로 시작해요.',
          bottle: '마지막 단어는 b로 시작해요.',
        }),
      },
      {
        id: 3,
        partnerPrompt: WHERE_PROMPT,
        partnerPromptKo: WHERE_PROMPT_KO,
        targetSentence: 'I left it in the gym.',
        targetSentenceKo: '체육관에 두고 왔어요.',
        keyWords: ['left', 'gym'],
        smallWords: ['i', 'it', 'in', 'the'],
        chunk1: 'I left it',
        chunk2: 'in the gym.',
        keyWordAliases: { gym: ['jim', 'gyms'] },
        getKeyWordClue: makeClue('I left it in the gym.', {
          left: 'left는 l로 시작해요.',
          gym: '장소는 g로 시작해요.',
        }),
      },
      {
        id: 4,
        partnerPrompt: 'Okay. Is there anything on it?',
        partnerPromptKo: '알겠어요. 물병에 뭔가 붙어 있나요?',
        targetSentence: 'It has a star sticker on it.',
        targetSentenceKo: '별 스티커가 붙어 있어요.',
        keyWords: ['star', 'sticker'],
        smallWords: ['it', 'has', 'a', 'on'],
        chunk1: 'It has a star sticker',
        chunk2: 'on it.',
        keyWordAliases: { star: ['stars'], sticker: ['stickers'] },
        getKeyWordClue: makeClue('It has a star sticker on it.', {
          star: '모양은 s로 시작해요.',
          sticker: '붙은 것은 s로 시작해요.',
        }),
      },
      thanksTurn('water bottle', '물병'),
    ],
  },
  {
    id: 'pencil_case',
    emoji: '✏️',
    labelEn: 'Yellow pencil case',
    labelKo: '노란 필통',
    situationEn: 'You lost your pencil case at school. Ask Sam at the lost-and-found desk for help.',
    situationKo: '학교에서 필통을 잃어버렸어요. 분실물 센터의 Sam에게 도움을 청해 보세요.',
    foundKo: '필통을 찾았어요!',
    resultImage: '/images/sam-pencil-case.jpg',
    resultAlt: 'Sam happily handing back the yellow pencil case',
    turns: [
      lostTurn('pencil case', '필통', 'pencil', ['pencils'], 'pencil은 p로 시작해요.'),
      {
        id: 2,
        partnerPrompt: DESCRIBE_PROMPT,
        partnerPromptKo: DESCRIBE_PROMPT_KO,
        targetSentence: 'It is a yellow pencil case.',
        targetSentenceKo: '노란색 필통이에요.',
        keyWords: ['yellow', 'pencil'],
        smallWords: ['it', 'is', 'a', 'case'],
        chunk1: 'It is a yellow',
        chunk2: 'pencil case.',
        keyWordAliases: { pencil: ['pencils'] },
        getKeyWordClue: makeClue('It is a yellow pencil case.', {
          yellow: '색깔은 y로 시작해요.',
          pencil: '물건은 p로 시작해요.',
        }),
      },
      {
        id: 3,
        partnerPrompt: WHERE_PROMPT,
        partnerPromptKo: WHERE_PROMPT_KO,
        targetSentence: 'I left it in the music room.',
        targetSentenceKo: '음악실에 두고 왔어요.',
        keyWords: ['left', 'music'],
        smallWords: ['i', 'it', 'in', 'the', 'room'],
        chunk1: 'I left it',
        chunk2: 'in the music room.',
        getKeyWordClue: makeClue('I left it in the music room.', {
          left: 'left는 l로 시작해요.',
          music: '장소는 m으로 시작해요.',
        }),
      },
      {
        id: 4,
        partnerPrompt: 'Okay. What is in your pencil case?',
        partnerPromptKo: '알겠어요. 필통 안에 무엇이 들어 있나요?',
        targetSentence: 'My red pen is in it.',
        targetSentenceKo: '안에 제 빨간 펜이 있어요.',
        keyWords: ['red', 'pen'],
        smallWords: ['my', 'is', 'in', 'it'],
        chunk1: 'My red pen',
        chunk2: 'is in it.',
        keyWordAliases: { pen: ['pens'] },
        getKeyWordClue: makeClue('My red pen is in it.', {
          red: '색깔은 r로 시작해요.',
          pen: '물건은 p로 시작해요.',
        }),
      },
      thanksTurn('pencil case', '필통'),
    ],
  },
  {
    id: 'umbrella',
    emoji: '☂️',
    labelEn: 'Black umbrella',
    labelKo: '검은 우산',
    situationEn: 'You lost your umbrella at school. Ask Sam at the lost-and-found desk for help.',
    situationKo: '학교에서 우산을 잃어버렸어요. 분실물 센터의 Sam에게 도움을 청해 보세요.',
    foundKo: '우산을 찾았어요!',
    resultImage: '/images/sam-umbrella.jpg',
    resultAlt: 'Sam happily handing back the black umbrella',
    turns: [
      lostTurn('umbrella', '우산', 'umbrella', ['umbrellas'], 'umbrella는 u로 시작해요.'),
      {
        id: 2,
        partnerPrompt: DESCRIBE_PROMPT,
        partnerPromptKo: DESCRIBE_PROMPT_KO,
        targetSentence: 'It is a black umbrella.',
        targetSentenceKo: '검은색 우산이에요.',
        keyWords: ['black', 'umbrella'],
        smallWords: ['it', 'is', 'a'],
        chunk1: 'It is a black',
        chunk2: 'umbrella.',
        keyWordAliases: { umbrella: ['umbrellas'] },
        getKeyWordClue: makeClue('It is a black umbrella.', {
          black: '색깔은 b로 시작해요.',
          umbrella: '마지막 단어는 u로 시작해요.',
        }),
      },
      {
        id: 3,
        partnerPrompt: WHERE_PROMPT,
        partnerPromptKo: WHERE_PROMPT_KO,
        targetSentence: 'I left it in the cafeteria.',
        targetSentenceKo: '급식실에 두고 왔어요.',
        keyWords: ['left', 'cafeteria'],
        smallWords: ['i', 'it', 'in', 'the'],
        chunk1: 'I left it',
        chunk2: 'in the cafeteria.',
        keyWordAliases: { cafeteria: ['cafeterias'] },
        getKeyWordClue: makeClue('I left it in the cafeteria.', {
          left: 'left는 l로 시작해요.',
          cafeteria: '장소는 c로 시작해요.',
        }),
      },
      {
        id: 4,
        partnerPrompt: 'Okay. Is there anything special about it?',
        partnerPromptKo: '알겠어요. 특별한 점이 있나요?',
        targetSentence: 'It has a white handle.',
        targetSentenceKo: '손잡이가 하얀색이에요.',
        keyWords: ['white', 'handle'],
        smallWords: ['it', 'has', 'a'],
        chunk1: 'It has a',
        chunk2: 'white handle.',
        keyWordAliases: { handle: ['handles'] },
        getKeyWordClue: makeClue('It has a white handle.', {
          white: '색깔은 w로 시작해요.',
          handle: '마지막 단어는 h로 시작해요.',
        }),
      },
      thanksTurn('umbrella', '우산'),
    ],
  },
];

export function getLostItem(id: ItemId): LostItem {
  return LOST_ITEMS.find((item) => item.id === id) ?? LOST_ITEMS[0];
}
