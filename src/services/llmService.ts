// LLM Service for generating Thai language learning content


const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_BASE_URL = 'https://api.openai.com/v1/chat/completions';

// Get the selected OpenAI model from localStorage, with fallback
const getSelectedModel = (): string => {
  return localStorage.getItem('openai_model') || 'gpt-4o-mini';
};

// Sound effects for correct/incorrect answers
export const playCorrectSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.warn('Could not play correct sound:', error);
  }
};

export const playIncorrectSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
    oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.15); // G3
    oscillator.frequency.setValueAtTime(174, audioContext.currentTime + 0.3); // F3

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.warn('Could not play incorrect sound:', error);
  }
};

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

// API prompt for generating comprehensive content
const combinedPrompt = `Generate the following Thai language learning content in a single JSON object. The content should be suitable for language learners and include: \n\n1.  **30 common Thai words** (single words, not compound, commonly used, mix of nouns, verbs, adjectives, expressions). Each word should have 'thai', 'phonetic', and 'english' fields.\n2.  **15 common Thai sentences** (everyday conversation, clear phonetic, English meaning). Each sentence should have 'thai', 'phonetic', and 'english' fields.\n3.  **10 daily life Thai questions** with corresponding phonetic, English, phonetic answer, and English answer. Each question should have 'thai', 'phonetic', 'english', 'phoneticAnswer', and 'englishAnswer' fields.\n\nEnsure variety, avoid duplicates, and provide the output in the exact JSON format: \n{\n  "words": [{"thai": "", "phonetic": "", "english": ""}, ...],\n  "sentences": [{"thai": "", "phonetic": "", "english": ""}, ...],\n  "questions": [{"thai": "", "phonetic": "", "english": "", "phoneticAnswer": "", "englishAnswer": ""}, ...]\n}\n`;

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

  // if (!OPENAI_API_KEY) {
  //   throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY environment variable.');
  // }

  interface LLMResponse {
    words: GeneratedWord[];
    sentences: GeneratedSentence[];
    questions: GeneratedQuestion[];
  }

  // const combinedPrompt = `Generate the following Thai language learning content in a single JSON object. The content should be suitable for language learners and include: \n\n1.  **30 common Thai words** (single words, not compound, commonly used, mix of nouns, verbs, adjectives, expressions). Each word should have 'thai', 'phonetic', and 'english' fields.\n2.  **15 common Thai sentences** (everyday conversation, clear phonetic, English meaning). Each sentence should have 'thai', 'phonetic', and 'english' fields.\n3.  **10 daily life Thai questions** with corresponding phonetic, English, phonetic answer, and English answer. Each question should have 'thai', 'phonetic', 'english', 'phoneticAnswer', and 'englishAnswer' fields.\n\nEnsure variety, avoid duplicates, and provide the output in the exact JSON format: \n{\n  "words": [{"thai": "", "phonetic": "", "english": ""}, ...],\n  "sentences": [{"thai": "", "phonetic": "", "english": ""}, ...],\n  "questions": [{"thai": "", "phonetic": "", "english": "", "phoneticAnswer": "", "englishAnswer": ""}, ...]\n}\n`;

  const fetchLLMContent = async (): Promise<LLMResponse> => {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured. Please set your API key in settings.');
    }

    console.log('🤖 Generating content with OpenAI API');

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: getSelectedModel(),
          messages: [
            {
              role: 'system',
              content: 'You are a Thai language learning assistant. Generate accurate, culturally appropriate content for language learners.',
            },
            {
              role: 'user',
              content: combinedPrompt,
            },
          ],
          max_tokens: 4000, // Increased max_tokens for comprehensive response
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from API');
      }

      let jsonContent = content.trim();
      if (jsonContent.startsWith('```json')) {
        const startIndex = jsonContent.indexOf('```json') + 7;
        const startContent = jsonContent.substring(startIndex).trim();
        if (startContent.endsWith('```')) {
          jsonContent = startContent.substring(0, startContent.length - 3).trim();
        } else {
          jsonContent = startContent;
        }
      } else if (jsonContent.startsWith('```')) {
        const startIndex = jsonContent.indexOf('```') + 3;
        const startContent = jsonContent.substring(startIndex).trim();
        if (startContent.endsWith('```')) {
          jsonContent = startContent.substring(0, startContent.length - 3).trim();
        } else {
          jsonContent = startContent;
        }
      }

      const parsedContent: LLMResponse = JSON.parse(jsonContent);

      // Basic validation
      if (!parsedContent.words || !Array.isArray(parsedContent.words) ||
          !parsedContent.sentences || !Array.isArray(parsedContent.sentences) ||
          !parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        throw new Error('Invalid response format from API: Missing or malformed arrays.');
      }

      return parsedContent;
    } catch (error) {
      console.error('Failed to generate LLM content:', error);
      throw new Error(`LLM content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Uncomment below to use OpenAI API when ready for production
    /*
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Thai language learning assistant. Generate accurate, culturally appropriate content for language learners.',
          },
          {
            role: 'user',
              content: combinedPrompt,
          },
        ],
          max_tokens: 4000, // Increased max_tokens for comprehensive response
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      const startIndex = jsonContent.indexOf('```json') + 7;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    } else if (jsonContent.startsWith('```')) {
      const startIndex = jsonContent.indexOf('```') + 3;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    }

      const parsedContent: LLMResponse = JSON.parse(jsonContent);

      // Basic validation
      if (!parsedContent.words || !Array.isArray(parsedContent.words) ||
          !parsedContent.sentences || !Array.isArray(parsedContent.sentences) ||
          !parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        throw new Error('Invalid response format from API: Missing or malformed arrays.');
    }

      return parsedContent;
  } catch (error) {
      console.error('Failed to generate LLM content:', error);
      throw new Error(`LLM content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  */
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

// Regenerate specific content types
export const regenerateWords = async (): Promise<void> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set your API key in settings.');
  }

  console.log('🔄 Regenerating words content with OpenAI API');

  const wordsPrompt = `Generate 30 common Thai words suitable for language learners. Each word should be:
1. A single word (not compound words or phrases)
2. Commonly used in everyday conversation
3. Have clear phonetic transcription and English meaning
4. Include a mix of nouns, verbs, adjectives, and common expressions

Provide them in this exact JSON format:
[{"thai": "Thai text", "phonetic": "phonetic transcription", "english": "English translation"}]

Ensure variety and avoid duplicates.`;

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Thai language learning assistant. Generate accurate, culturally appropriate content for language learners.',
          },
          {
            role: 'user',
            content: wordsPrompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      const startIndex = jsonContent.indexOf('```json') + 7;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    } else if (jsonContent.startsWith('```')) {
      const startIndex = jsonContent.indexOf('```') + 3;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    }

    const words: GeneratedWord[] = JSON.parse(jsonContent);

    // Validate the response structure
    if (!Array.isArray(words) || words.length === 0) {
      throw new Error('Invalid response format from API');
    }

    // Validate each word has required properties
    for (const word of words) {
      if (!word.thai || !word.phonetic || !word.english) {
        throw new Error('Incomplete word data received from API');
      }
    }

    // Update cached content with new words
    if (cachedLLMContent) {
      cachedLLMContent.words = words;
    }

  } catch (error) {
    console.error('Failed to regenerate words:', error);
    throw new Error(`Word regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const regenerateSentences = async (): Promise<void> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set your API key in settings.');
  }

  console.log('🔄 Regenerating sentences content with OpenAI API');

  const sentencesPrompt = `Generate 15 common Thai sentences suitable for language learners. Each sentence should be:
1. Everyday conversation sentences
2. Clear phonetic transcription
3. Natural English meaning
4. Vary in complexity from simple to intermediate

Provide them in this exact JSON format:
[{"thai": "Thai sentence", "phonetic": "phonetic transcription", "english": "English translation"}]

Ensure variety and avoid duplicates.`;

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Thai language learning assistant. Generate accurate, culturally appropriate content for language learners.',
          },
          {
            role: 'user',
            content: sentencesPrompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      const startIndex = jsonContent.indexOf('```json') + 7;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    } else if (jsonContent.startsWith('```')) {
      const startIndex = jsonContent.indexOf('```') + 3;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    }

    const sentences: GeneratedSentence[] = JSON.parse(jsonContent);

    // Validate the response structure
    if (!Array.isArray(sentences) || sentences.length === 0) {
      throw new Error('Invalid response format from API');
    }

    // Validate each sentence has required properties
    for (const sentence of sentences) {
      if (!sentence.thai || !sentence.phonetic || !sentence.english) {
        throw new Error('Incomplete sentence data received from API');
      }
    }

    // Update cached content with new sentences
    if (cachedLLMContent) {
      cachedLLMContent.sentences = sentences;
    }

  } catch (error) {
    console.error('Failed to regenerate sentences:', error);
    throw new Error(`Sentence regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const regenerateQuestions = async (): Promise<void> => {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please set your API key in settings.');
  }

  console.log('🔄 Regenerating questions content with OpenAI API');

  const questionsPrompt = `Generate 10 daily life Thai questions with answers suitable for language learners. Each question should have:
1. A natural Thai question for daily life situations
2. Clear phonetic transcription of the question
3. English translation of the question
4. Phonetic transcription of the appropriate answer
5. English translation of the answer

Provide them in this exact JSON format:
[{"thai": "Thai question", "phonetic": "question phonetic", "english": "question English", "phoneticAnswer": "answer phonetic", "englishAnswer": "answer English"}]

Ensure variety and avoid duplicates. Focus on practical daily life scenarios.`;

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a Thai language learning assistant. Generate accurate, culturally appropriate content for language learners.',
          },
          {
            role: 'user',
            content: questionsPrompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content received from API');
    }

    let jsonContent = content.trim();
    if (jsonContent.startsWith('```json')) {
      const startIndex = jsonContent.indexOf('```json') + 7;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    } else if (jsonContent.startsWith('```')) {
      const startIndex = jsonContent.indexOf('```') + 3;
      const startContent = jsonContent.substring(startIndex).trim();
      if (startContent.endsWith('```')) {
        jsonContent = startContent.substring(0, startContent.length - 3).trim();
      } else {
        jsonContent = startContent;
      }
    }

    const questions: GeneratedQuestion[] = JSON.parse(jsonContent);

    // Validate the response structure
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Invalid response format from API');
    }

    // Validate each question has required properties
    for (const question of questions) {
      if (!question.thai || !question.phonetic || !question.english || !question.phoneticAnswer || !question.englishAnswer) {
        throw new Error('Incomplete question data received from API');
      }
    }

    // Update cached content with new questions
    if (cachedLLMContent) {
      cachedLLMContent.questions = questions;
    }

  } catch (error) {
    console.error('Failed to regenerate questions:', error);
    throw new Error(`Question regeneration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
  
