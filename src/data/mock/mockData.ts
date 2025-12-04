// Mock data for Thai language learning content
// This file contains all mock data used when the OpenAI API is not available

import type { GeneratedWord, GeneratedSentence, GeneratedQuestion } from '../../services/llmService';

export const mockWords: GeneratedWord[] = [
  { thai: 'สวัสดี', phonetic: 'sawasdee', english: 'hello' },
  { thai: 'ขอบคุณ', phonetic: 'khop khun', english: 'thank you' },
  { thai: 'น้ำ', phonetic: 'naam', english: 'water' },
  { thai: 'อาหาร', phonetic: 'aa-haan', english: 'food' },
  { thai: 'บ้าน', phonetic: 'baan', english: 'house' },
  { thai: 'คน', phonetic: 'khon', english: 'person' },
  { thai: 'ไป', phonetic: 'pai', english: 'go' },
  { thai: 'มา', phonetic: 'maa', english: 'come' },
  { thai: 'ดี', phonetic: 'dee', english: 'good' },
  { thai: 'ไม่', phonetic: 'mai', english: 'no/not' },
  { thai: 'ใช่', phonetic: 'chai', english: 'yes' },
  { thai: 'อะไร', phonetic: 'a-rai', english: 'what' },
  { thai: 'ใคร', phonetic: 'khrai', english: 'who' },
  { thai: 'เมื่อไหร่', phonetic: 'meua rai', english: 'when' },
  { thai: 'ทำไม', phonetic: 'tham mai', english: 'why' },
  { thai: 'อย่างไร', phonetic: 'yang rai', english: 'how' },
  { thai: 'วันนี้', phonetic: 'wan nee', english: 'today' },
  { thai: 'เมื่อวาน', phonetic: 'meua waan', english: 'yesterday' },
  { thai: 'พรุ่งนี้', phonetic: 'phrung nee', english: 'tomorrow' },
  { thai: 'กิน', phonetic: 'kin', english: 'eat' },
  { thai: 'ดื่ม', phonetic: 'deum', english: 'drink' },
  { thai: 'นอน', phonetic: 'non', english: 'sleep' },
  { thai: 'อ่าน', phonetic: 'aan', english: 'read' },
  { thai: 'เขียน', phonetic: 'khian', english: 'write' },
  { thai: 'วิ่ง', phonetic: 'wing', english: 'run' },
  { thai: 'เดิน', phonetic: 'doen', english: 'walk' },
  { thai: 'พูด', phonetic: 'phuut', english: 'speak' },
  { thai: 'ฟัง', phonetic: 'fang', english: 'listen' },
  { thai: 'เห็น', phonetic: 'hen', english: 'see' },
  { thai: 'รัก', phonetic: 'rak', english: 'love' },
];

export const mockSentences: GeneratedSentence[] = [
  { thai: 'สวัสดีครับ', phonetic: 'sawasdee khrap', english: 'Hello (male speaker)' },
  { thai: 'ขอบคุณค่ะ', phonetic: 'khop khun kha', english: 'Thank you (female speaker)' },
  { thai: 'คุณชื่ออะไร', phonetic: 'khun cheu a-rai', english: 'What is your name?' },
  { thai: 'ผมชื่อจอห์น', phonetic: 'phom cheu John', english: 'My name is John' },
  { thai: 'วันนี้อากาศร้อน', phonetic: 'wan nee a-gaat ron', english: 'Today the weather is hot' },
  { thai: 'ฉันชอบกินอาหารไทย', phonetic: 'chan chop kin aa-haan thai', english: 'I like to eat Thai food' },
  { thai: 'บ้านของฉันอยู่ที่นี่', phonetic: 'baan khong chan yoo thee nee', english: 'My house is here' },
  { thai: 'คุณมาจากไหน', phonetic: 'khun maa chak nai', english: 'Where are you from?' },
  { thai: 'ฉันมาจากอเมริกา', phonetic: 'chan maa chak America', english: 'I am from America' },
  { thai: 'ตอนนี้กี่โมงแล้ว', phonetic: 'ton nee gee mong laeo', english: 'What time is it now?' },
  { thai: 'ตอนนี้สี่โมงเย็น', phonetic: 'ton nee see mong yen', english: 'It is 4 PM now' },
  { thai: 'คุณพูดภาษาไทยได้ไหม', phonetic: 'khun phuut pha-saa thai dai mai', english: 'Can you speak Thai?' },
  { thai: 'ฉันพูดได้นิดหน่อย', phonetic: 'chan phuut dai nit noi', english: 'I can speak a little' },
  { thai: 'อาหารนี้อร่อยมาก', phonetic: 'aa-haan nee aroi mak', english: 'This food is very delicious' },
  { thai: 'ขอให้มีความสุข', phonetic: 'kho hai mee khwam suk', english: 'Wish you happiness' },
];

export const mockQuestions: GeneratedQuestion[] = [
  { thai: 'คุณชื่ออะไร', phonetic: 'khun cheu a-rai', english: 'What is your name?', phoneticAnswer: 'phom cheu John', englishAnswer: 'My name is John' },
  { thai: 'คุณมาจากไหน', phonetic: 'khun maa chak nai', english: 'Where are you from?', phoneticAnswer: 'chan maa chak America', englishAnswer: 'I come from America' },
  { thai: 'ตอนนี้กี่โมง', phonetic: 'ton nee gee mong', english: 'What time is it?', phoneticAnswer: 'ton nee saam mong', englishAnswer: 'It is 3 o\'clock' },
  { thai: 'วันนี้วันอะไร', phonetic: 'wan nee wan a-rai', english: 'What day is today?', phoneticAnswer: 'wan nee wan jan', englishAnswer: 'Today is Monday' },
  { thai: 'คุณทำอะไรอยู่', phonetic: 'khun tham a-rai yoo', english: 'What are you doing?', phoneticAnswer: 'chan tham ngan yoo', englishAnswer: 'I am working' },
  { thai: 'คุณชอบอาหารอะไร', phonetic: 'khun chop aa-haan a-rai', english: 'What food do you like?', phoneticAnswer: 'chan chop aa-haan thai', englishAnswer: 'I like Thai food' },
  { thai: 'บ้านคุณอยู่ที่ไหน', phonetic: 'baan khun yoo thee nai', english: 'Where is your house?', phoneticAnswer: 'baan chan yoo nai Bangkok', englishAnswer: 'My house is in Bangkok' },
  { thai: 'คุณอายุเท่าไร', phonetic: 'khun aa-yu thao rai', english: 'How old are you?', phoneticAnswer: 'chan aa-yu yee-sip pee', englishAnswer: 'I am 25 years old' },
  { thai: 'คุณเรียนภาษาไทยมานานแค่ไหน', phonetic: 'khun rian pha-saa thai maa naan khae nai', english: 'How long have you been learning Thai?', phoneticAnswer: 'chan rian maa saam duean laeo', englishAnswer: 'I have been learning for 3 months' },
  { thai: 'คุณมีครอบครัวกี่คน', phonetic: 'khun mee khrop khraw gee khon', english: 'How many people are in your family?', phoneticAnswer: 'khrop khraw chan mee saam khon', englishAnswer: 'My family has 3 people' },
];
