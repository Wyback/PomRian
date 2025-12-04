// LLM Service for generating Thai language learning content
// Currently using mock data. To enable OpenAI API, uncomment the API code below and comment out mock data.

import { mockWords, mockSentences, mockQuestions } from '../data/mock/mockData';

/*
// API Configuration (uncomment to enable API)
// const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
// const API_BASE_URL = 'https://api.openai.com/v1/chat/completions';
// const getSelectedModel = (): string => localStorage.getItem('openai_model') || 'gpt-4o-mini';
*/


export interface GeneratedWord {
  thai: string;
  phonetic: string;
  english: string;
}

export interface GeneratedSentence {
  thai: string;
  phonetic: string;
  english: string;
}

export interface GeneratedQuestion {
  thai: string;
  phonetic: string;
  english: string;
  phoneticAnswer: string;
  englishAnswer: string;
}


export const generateWords = async (count: number = 30): Promise<GeneratedWord[]> => {
  if (!isLLMContentAvailable()) {
    throw new Error('LLM content not generated yet. Please click the generate content button first.');
  }
  const content = await getLLMContent();
  const shuffled = [...content.words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const generateSentences = async (count: number = 15): Promise<GeneratedSentence[]> => {
  if (!isLLMContentAvailable()) {
    throw new Error('LLM content not generated yet. Please click the generate content button first.');
  }
  const content = await getLLMContent();
  const shuffled = [...content.sentences].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const generateDailyLifeQuestions = async (count: number = 10): Promise<GeneratedQuestion[]> => {
  if (!isLLMContentAvailable()) {
    throw new Error('LLM content not generated yet. Please click the generate content button first.');
  }
  const content = await getLLMContent();
  const shuffled = [...content.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

interface LLMResponse {
  words: GeneratedWord[];
  sentences: GeneratedSentence[];
  questions: GeneratedQuestion[];
}

  // Mock data for development - comment out API call
  const fetchLLMContent = async (): Promise<LLMResponse> => {
    console.log('🔧 Using mock LLM data for development');

    // Mock data imported from separate file
    const mockData: LLMResponse = {
      words: mockWords,
      sentences: mockSentences,
      questions: mockQuestions,
    };

    return mockData;
  };

let cachedLLMContent: LLMResponse | null = null;

export const getLLMContent = async (): Promise<LLMResponse> => {
  if (!cachedLLMContent) {
    cachedLLMContent = await fetchLLMContent();
  }
  return cachedLLMContent;
};

export const generateLLMContent = async (): Promise<LLMResponse> => {
  cachedLLMContent = await fetchLLMContent();
  return cachedLLMContent;
};

export const isLLMContentAvailable = (): boolean => {
  return cachedLLMContent !== null;
};

// Regenerate specific content types - using mock data for development
export const regenerateWords = async (): Promise<void> => {
  console.log('🔄 Regenerating words content with mock data');

  // Update cached content with mock words
  if (cachedLLMContent) {
    cachedLLMContent.words = mockWords;
  }
};

export const regenerateSentences = async (): Promise<void> => {
  console.log('🔄 Regenerating sentences content with mock data');

  // Update cached content with mock sentences
  if (cachedLLMContent) {
    cachedLLMContent.sentences = mockSentences;
  }
};

export const regenerateQuestions = async (): Promise<void> => {
  console.log('🔄 Regenerating questions content with mock data');

  // Update cached content with mock questions
  if (cachedLLMContent) {
    cachedLLMContent.questions = mockQuestions;
  }
};
  
