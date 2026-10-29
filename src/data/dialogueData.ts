import { PracticeTurn } from '../types';

export const DIALOGUE_TURNS: PracticeTurn[] = [
  {
    id: 1,
    partnerPrompt: 'Hi! This is the lost-and-found desk. What brings you here?',
    partnerPromptKo: '안녕하세요! 분실물 센터예요. 무슨 일로 오셨나요?',
    targetSentence: 'I lost my bag. Can you help me?',
    targetSentenceKo: '가방을 잃어버렸어요. 도와줄 수 있어요?',
    keyWords: ['lost', 'bag', 'help'],
    smallWords: ['i', 'my', 'can', 'you', 'me'],
    chunk1: 'I lost my bag.',
    chunk2: 'Can you help me?',
    getKeyWordClue: (missing: string) => {
      const lower = missing.toLowerCase();
      if (lower === 'lost') {
        return {
          hintSentence: 'I l___ my bag. Can you help me?',
          hintKo: 'lost는 l로 시작해요.',
        };
      }
      if (lower === 'bag') {
        return {
          hintSentence: 'I lost my b___. Can you help me?',
          hintKo: 'bag은 b로 시작해요.',
        };
      }
      return {
        hintSentence: 'I lost my bag. Can you h___ me?',
        hintKo: 'help는 h로 시작해요.',
      };
    },
  },
  {
    id: 2,
    partnerPrompt: 'Sure! What does it look like?',
    partnerPromptKo: '물론이죠! 어떻게 생겼나요?',
    targetSentence: 'It is a blue backpack.',
    targetSentenceKo: '파란색 책가방이에요.',
    keyWords: ['blue', 'backpack'],
    smallWords: ['it', 'is', 'a'],
    chunk1: 'It is a blue',
    chunk2: 'backpack.',
    getKeyWordClue: (missing: string) => {
      const lower = missing.toLowerCase();
      if (lower === 'blue') {
        return {
          hintSentence: 'It is a b___ backpack.',
          hintKo: '색깔은 b로 시작해요.',
        };
      }
      return {
        hintSentence: 'It is a blue b___.',
        hintKo: '마지막 단어는 b로 시작해요.',
      };
    },
  },
  {
    id: 3,
    partnerPrompt: 'Where did you leave it?',
    partnerPromptKo: '어디에 두고 오셨나요?',
    targetSentence: 'I left it in the library.',
    targetSentenceKo: '도서관에 두고 왔어요.',
    keyWords: ['left', 'library'],
    smallWords: ['i', 'it', 'in', 'the'],
    chunk1: 'I left it',
    chunk2: 'in the library.',
    getKeyWordClue: (missing: string) => {
      const lower = missing.toLowerCase();
      if (lower === 'left') {
        return {
          hintSentence: 'I l___ it in the library.',
          hintKo: 'left는 l로 시작해요.',
        };
      }
      return {
        hintSentence: 'I left it in the l___.',
        hintKo: '장소는 l로 시작해요.',
      };
    },
  },
  {
    id: 4,
    partnerPrompt: 'Okay. What is in your bag?',
    partnerPromptKo: '알겠어요. 가방 안에 무엇이 들어있나요?',
    targetSentence: 'My English book is in it.',
    targetSentenceKo: '안에 제 영어책이 있어요.',
    keyWords: ['english', 'book'],
    smallWords: ['my', 'is', 'in', 'it'],
    chunk1: 'My English book',
    chunk2: 'is in it.',
    getKeyWordClue: (missing: string) => {
      const lower = missing.toLowerCase();
      if (lower === 'english') {
        return {
          hintSentence: 'My E___ book is in it.',
          hintKo: '과목은 E로 시작해요.',
        };
      }
      return {
        hintSentence: 'My English b___ is in it.',
        hintKo: '물건은 b로 시작해요.',
      };
    },
  },
  {
    id: 5,
    partnerPrompt: 'Is this your bag?',
    partnerPromptKo: '이게 당신의 가방인가요?',
    targetSentence: 'Yes, it is! Thank you so much!',
    targetSentenceKo: '네, 맞아요! 정말 고마워요!',
    keyWords: ['yes', 'thank'],
    smallWords: ['it', 'is', 'you', 'so', 'much'],
    chunk1: 'Yes, it is!',
    chunk2: 'Thank you so much!',
    getKeyWordClue: (missing: string) => {
      const lower = missing.toLowerCase();
      if (lower === 'yes') {
        return {
          hintSentence: 'Y___, it is! Thank you so much!',
          hintKo: '시작은 Y로 시작해요.',
        };
      }
      return {
        hintSentence: 'Yes, it is! T___ you so much!',
        hintKo: '감사는 T로 시작해요.',
      };
    },
  },
];
