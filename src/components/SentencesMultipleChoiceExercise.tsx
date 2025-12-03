import React, { useState, useEffect } from 'react';
import type { Exercise as ExerciseType, ExerciseCard, Level } from '../types';
import { generateSentences, type GeneratedSentence } from '../services/llmService';
import { Exercise } from './Exercise';

interface SentencesMultipleChoiceExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  showPhonetic: boolean; // New prop for phonetic visibility
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const SentencesMultipleChoiceExercise: React.FC<SentencesMultipleChoiceExerciseProps> = ({
  level,
  onComplete,
  onBack,
  showPhonetic, // Destructure new prop
  onProgress,
  currentProgress = 0,
}) => {
  const [sentences, setSentences] = useState<GeneratedSentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSentences = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedSentences = await generateSentences(30); // More sentences for variety
        setSentences(generatedSentences);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sentences');
        console.error('Failed to load sentences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSentences();
  }, []);

  const generateSentenceExercise = (): ExerciseType => {
    if (sentences.length === 0) {
      throw new Error('No sentences available for exercise generation');
    }

    // Pick a random correct sentence
    const correctSentence = sentences[Math.floor(Math.random() * sentences.length)];

    // Get 3 wrong answers from other sentences
    const wrongAnswers = sentences.filter(sentence => sentence.thai !== correctSentence.thai);
    const selectedWrongAnswers = wrongAnswers
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Create target (what the user needs to find) - show Thai sentence
    const target = {
      thai: correctSentence.thai,
      phonetic: correctSentence.phonetic,
      english: correctSentence.english,
    };

    // Create cards - show phonetic transcriptions with English meanings
    const cards: ExerciseCard[] = [
      {
        id: `correct-${correctSentence.thai}`,
        thai: '', // Empty, so phonetic-only and English meaning are displayed
        phonetic: correctSentence.phonetic,
        english: correctSentence.english,
        isCorrect: true,
      },
      ...selectedWrongAnswers.map((wrong, index) => ({
        id: `wrong-${index}-${wrong.thai}`,
        thai: '', // Empty, so phonetic-only and English meaning are displayed
        phonetic: wrong.phonetic,
        english: wrong.english,
        isCorrect: false,
      })),
    ];

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
        <p>📝 Loading sentences...</p>
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
      generateExercise={generateSentenceExercise}
      showPhonetic={showPhonetic} // Pass the new prop to Exercise
      onProgress={onProgress}
      currentProgress={currentProgress}
    />
  );
};
