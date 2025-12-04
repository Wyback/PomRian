import React, { useState, useEffect } from 'react';
import type { Exercise as ExerciseType, Level } from '../../types';
import { generateSentences, type GeneratedSentence } from '../../services/llmService';
import { playCorrectSound, playIncorrectSound } from '../../services/soundService';

interface SentencesAdvancedExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  showPhonetic: boolean; // New prop for phonetic visibility
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const SentencesAdvancedExercise: React.FC<SentencesAdvancedExerciseProps> = ({
  level,
  onComplete,
  onBack,
  showPhonetic, // Destructure new prop
  onProgress,
  currentProgress = 0,
}) => {
  const [sentences, setSentences] = useState<GeneratedSentence[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExercises] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSentences = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedSentences = await generateSentences(25); // More sentences for variety
        setSentences(generatedSentences);
        if (!currentExercise) {
          setCurrentExercise(generateSentenceExercise(generatedSentences));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sentences');
        console.error('Failed to load sentences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSentences();
  }, []);

  const generateSentenceExercise = (sentenceList: GeneratedSentence[]): ExerciseType => {
    if (sentenceList.length === 0) {
      throw new Error('No sentences available for exercise generation');
    }

    const correctSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];

    return {
      level: level.id,
      target: {
        thai: correctSentence.thai,
        phonetic: correctSentence.phonetic,
        english: correctSentence.english,
      },
      cards: [], // Not used in input exercises
      correctAnswer: {
        id: 'correct',
        thai: '',
        phonetic: correctSentence.phonetic,
        isCorrect: true,
      },
      completed: false,
    };
  };

  const handleSubmit = () => {
    if (!currentExercise || showResult) return;

    const correct = userInput.trim().toLowerCase() === currentExercise.target.phonetic.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectCount(prev => prev + 1);
      // Call progress callback for persistent tracking
      onProgress?.(1);
      // Play correct sound
      playCorrectSound();
    } else {
      // Play incorrect sound
      playIncorrectSound();
    }

    // Auto-advance after showing result (slightly faster for advanced level)
    setTimeout(() => {
      if (correctCount + (correct ? 1 : 0) >= totalExercises) {
        onComplete(level.id);
      } else {
        setCurrentExercise(generateSentenceExercise(sentences));
        setUserInput('');
        setShowResult(false);
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <div className="exercise-loading">
        <div className="loading-spinner"></div>
        <p>🎯 Loading advanced sentences...</p>
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

  if (!currentExercise) {
    return <div className="loading">Loading exercise...</div>;
  }

  // Show persistent progress instead of session progress
  const progress = Math.min((currentProgress / 100) * 100, 100);

  return (
    <div className="exercise">
      <div className="exercise-header">
        <button className="back-button" onClick={onBack} title="Back to Levels">
          ❮
        </button>
        <h2>Level {level.id}: {level.name}</h2>
      </div>

      <div className="exercise-content">

        <div className="exercise-target">
          <div className="target-display">
            <div className="target-thai-sentence">{currentExercise.target.thai}</div>
            <div className="target-english">{currentExercise.target.english}</div>
          </div>
        </div>

        <div className="input-section">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter phonetic transcription..."
            className="phonetic-input"
            disabled={showResult}
            autoFocus
          />
          <button
            onClick={handleSubmit}
            disabled={showResult || !userInput.trim()}
            className="submit-button"
          >
            Submit
          </button>
        </div>

        {showResult && (
          <div className={`result ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '🎉 Perfect!' : `❌ Incorrect! The correct answer is: ${showPhonetic ? currentExercise.target.phonetic : '[Hidden]'}`}
          </div>
        )}
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
