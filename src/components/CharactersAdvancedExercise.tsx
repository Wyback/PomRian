import React, { useState } from 'react';
import type { Exercise as ExerciseType, Level } from '../types';
import { thaiConsonants, thaiVowels } from '../data/thaiData';
import { playCorrectSound, playIncorrectSound } from '../services/llmService';

interface CharactersAdvancedExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  showPhonetic?: boolean; // Add optional showPhonetic prop
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const CharactersAdvancedExercise: React.FC<CharactersAdvancedExerciseProps> = ({
  level,
  onComplete,
  onBack,
  showPhonetic, // Destructure new prop
  onProgress,
  currentProgress = 0,
}) => {
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExercises] = useState(10);

  const generateCharacterExercise = (): ExerciseType => {
    // Combine consonants and vowels for more variety
    const allCharacters = [...thaiConsonants, ...thaiVowels];
    const randomChar = allCharacters[Math.floor(Math.random() * allCharacters.length)];

    return {
      level: level.id,
      target: {
        thai: randomChar.thai,
        phonetic: randomChar.phonetic,
      },
      cards: [], // Not used in input exercises
      correctAnswer: {
        id: 'correct',
        thai: '',
        phonetic: randomChar.phonetic,
        isCorrect: true,
      },
      completed: false,
    };
  };

  React.useEffect(() => {
    if (!currentExercise) {
      setCurrentExercise(generateCharacterExercise());
    }
  }, [currentExercise]);

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

    // Auto-advance after showing result
    setTimeout(() => {
      if (correctCount + (correct ? 1 : 0) >= totalExercises) {
        onComplete(level.id);
      } else {
        setCurrentExercise(generateCharacterExercise());
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
            <div className="target-thai-large">{currentExercise.target.thai}</div>
            {/* Always show phonetic for this exercise */}
            <div className="target-english">[{currentExercise.target.phonetic}]</div>
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
            {isCorrect ? '✅ Correct!' : `❌ Incorrect! The correct answer is: ${currentExercise.target.phonetic}`}
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
