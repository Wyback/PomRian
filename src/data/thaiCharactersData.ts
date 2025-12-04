import type { ThaiCharacter } from '../types';

export type { ThaiCharacter };

export const thaiConsonants: ThaiCharacter[] = [
  // High consonants
  { thai: 'ก', phonetic: 'k', name: 'ko kai' },
  { thai: 'ข', phonetic: 'kh', name: 'kho khai' },
  { thai: 'ฃ', phonetic: 'kh', name: 'kho khuat' },
  { thai: 'ค', phonetic: 'kh', name: 'kho khwai' },
  { thai: 'ฅ', phonetic: 'kh', name: 'kho khon' },
  { thai: 'ฆ', phonetic: 'kh', name: 'kho rakhang' },

  // Middle consonants
  { thai: 'ง', phonetic: 'ng', name: 'ngo ngu' },
  { thai: 'จ', phonetic: 'ch', name: 'cho chan' },
  { thai: 'ฉ', phonetic: 'ch', name: 'cho ching' },
  { thai: 'ช', phonetic: 'ch', name: 'cho chang' },
  { thai: 'ซ', phonetic: 's', name: 'so so' },
  { thai: 'ฌ', phonetic: 'ch', name: 'cho choe' },
  { thai: 'ญ', phonetic: 'y', name: 'yo ying' },

  // Low consonants
  { thai: 'ฎ', phonetic: 'd', name: 'do chada' },
  { thai: 'ฏ', phonetic: 't', name: 'to patak' },
  { thai: 'ฐ', phonetic: 'th', name: 'tho than' },
  { thai: 'ฑ', phonetic: 'th', name: 'tho montho' },
  { thai: 'ฒ', phonetic: 'th', name: 'tho phuthao' },
  { thai: 'ณ', phonetic: 'n', name: 'no nen' },
  { thai: 'ด', phonetic: 'd', name: 'do dek' },
  { thai: 'ต', phonetic: 't', name: 'to tao' },
  { thai: 'ถ', phonetic: 'th', name: 'tho thung' },
  { thai: 'ท', phonetic: 'th', name: 'tho thahan' },
  { thai: 'ธ', phonetic: 'th', name: 'tho thong' },
  { thai: 'น', phonetic: 'n', name: 'no nu' },
  { thai: 'บ', phonetic: 'b', name: 'bo baimai' },
  { thai: 'ป', phonetic: 'p', name: 'po pla' },
  { thai: 'ผ', phonetic: 'ph', name: 'pho phung' },
  { thai: 'ฝ', phonetic: 'f', name: 'fo fa' },
  { thai: 'พ', phonetic: 'ph', name: 'pho phan' },
  { thai: 'ฟ', phonetic: 'f', name: 'fo fan' },
  { thai: 'ภ', phonetic: 'ph', name: 'pho samphao' },
  { thai: 'ม', phonetic: 'm', name: 'mo ma' },
  { thai: 'ย', phonetic: 'y', name: 'yo yak' },
  { thai: 'ร', phonetic: 'r', name: 'ro ruea' },
  { thai: 'ล', phonetic: 'l', name: 'lo ling' },
  { thai: 'ว', phonetic: 'w', name: 'wo waen' },
  { thai: 'ศ', phonetic: 's', name: 'so sala' },
  { thai: 'ษ', phonetic: 's', name: 'so rusi' },
  { thai: 'ส', phonetic: 's', name: 'so suea' },
  { thai: 'ห', phonetic: 'h', name: 'ho hip' },
  { thai: 'ฬ', phonetic: 'l', name: 'lo chula' },
  { thai: 'อ', phonetic: 'ʔ', name: 'o ang' },
  { thai: 'ฮ', phonetic: 'h', name: 'ho nokhuk' },
];

export const thaiVowels: ThaiCharacter[] = [
  // Short vowels
  { thai: 'ะ', phonetic: 'a', name: 'sara a' },
  { thai: 'ิ', phonetic: 'i', name: 'sara i' },
  { thai: 'ึ', phonetic: 'ue', name: 'sara ue' },
  { thai: 'ุ', phonetic: 'u', name: 'sara u' },
  { thai: 'เ', phonetic: 'e', name: 'sara e' },
  { thai: 'โ', phonetic: 'o', name: 'sara o' },
  { thai: 'ฤ', phonetic: 'rue', name: 'sara rue' },

  // Long vowels
  { thai: 'า', phonetic: 'aa', name: 'sara aa' },
  { thai: 'ี', phonetic: 'ii', name: 'sara ii' },
  { thai: 'ื', phonetic: 'uue', name: 'sara uue' },
  { thai: 'ู', phonetic: 'uu', name: 'sara uu' },
  { thai: 'เา', phonetic: 'ao', name: 'sara ao' },
  { thai: 'อ', phonetic: 'o', name: 'sara o' },

  // Diphthongs
  { thai: 'ไ', phonetic: 'ai', name: 'sara ai' },
  { thai: 'ใ', phonetic: 'ai', name: 'sara ai' },
  { thai: 'เอ', phonetic: 'oe', name: 'sara oe' },
  { thai: 'เ', phonetic: 'e', name: 'sara e' },
  { thai: 'แ', phonetic: 'ae', name: 'sara ae' },
  { thai: 'โ', phonetic: 'o', name: 'sara o' },
  { thai: 'เา', phonetic: 'ao', name: 'sara ao' },
  { thai: 'อา', phonetic: 'a', name: 'sara a' },
];

export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomWrongAnswers = (
  correct: ThaiCharacter,
  allItems: ThaiCharacter[],
  count: number
): ThaiCharacter[] => {
  const wrongItems = allItems.filter(item => item.thai !== correct.thai);
  return getRandomItems(wrongItems, count);
};
