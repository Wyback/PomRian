import React, { useState, useEffect } from 'react';
import type { Exercise as ExerciseType, ExerciseCard, Level } from '../../types';
import { generateWords, type GeneratedWord } from '../../services/llmService';
import { Exercise } from './Exercise';

interface WordsMultipleChoiceExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  showPhonetic: boolean; // New prop for phonetic visibility
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const WordsMultipleChoiceExercise: React.FC<WordsMultipleChoiceExerciseProps> = ({
  level,
  onComplete,
  onBack,
  showPhonetic,
  onProgress,
  currentProgress = 0,
}) => {
  const [words, setWords] = useState<GeneratedWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWords = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedWords = await generateWords(50); // More words for variety
        setWords(generatedWords);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load words');
        console.error('Failed to load words:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, []);

  const generateWordExercise = (): ExerciseType => {
    if (words.length === 0) {
      throw new Error('No words available for exercise generation');
    }

    // Pick a random correct word
    const correctWord = words[Math.floor(Math.random() * words.length)];

    // Get 3 wrong answers
    const wrongAnswers = words.filter(word => word.thai !== correctWord.thai);
    const selectedWrongAnswers = wrongAnswers
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Create target (what the user needs to find) - show Thai word
    const target = {
      thai: correctWord.thai,
      phonetic: correctWord.phonetic,
    };

    // Create cards - show phonetic transcriptions with English meanings
    const cards: ExerciseCard[] = [
      {
        id: `correct-${correctWord.thai}`,
        thai: '', // Empty - will show phonetic + english
        phonetic: correctWord.phonetic,
        isCorrect: true,
      },
      ...selectedWrongAnswers.map((wrong, index) => ({
        id: `wrong-${index}-${wrong.thai}`,
        thai: '', // Empty - will show phonetic + english
        phonetic: wrong.phonetic,
        isCorrect: false,
      })),
    ];

    // Store the English meanings for the cards
    cards.forEach(card => {
      if (card.isCorrect) {
        card.english = correctWord.english;
      } else {
        const wrongWord = selectedWrongAnswers.find(w => w.phonetic === card.phonetic);
        if (wrongWord) {
          card.english = wrongWord.english;
        }
      }
    });

    // Shuffle cards
    const shuffledCards = cards.sort(() => Math.random() - 0.5);

    return {
      level: level.id,
      target,
      cards: shuffledCards,
      correctAnswer: cards.find(card => card.isCorrect)!, // The correct one
      completed: false,
    };
  };

  if (loading) {
    return (
      <div className="exercise-loading">
        <div className="loading-spinner"></div>
        <p>📚 Loading vocabulary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exercise-error">
        <h3>❌ Error Occurred</h3>
        <p>{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          🔄 Try Again
        </button>
      </div>
    );
  }

  return (
    <Exercise
      level={level}
      onComplete={onComplete}
      onBack={onBack}
      generateExercise={generateWordExercise}
      showPhonetic={showPhonetic} // Pass showPhonetic
      onProgress={onProgress}
      currentProgress={currentProgress}
    />
  );
};
