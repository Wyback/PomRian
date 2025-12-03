import React, { useState } from 'react';
import type { Exercise as ExerciseType, ExerciseCard, Level } from '../types';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';
import { playCorrectSound, playIncorrectSound } from '../services/llmService';

interface ExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  generateExercise: () => ExerciseType;
  questionText?: string;
  showPhonetic?: boolean; // New prop for phonetic visibility
  onProgress?: (correctAnswers: number) => void; // Progress callback for Level 1
  currentProgress?: number; // Total persistent progress for Level 1
}

export const Exercise: React.FC<ExerciseProps> = ({
  level,
  onComplete,
  onBack,
  generateExercise,
  questionText,
  showPhonetic = false, // Destructure new prop with a default value
  onProgress,
  currentProgress = 0,
}) => {
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(() => generateExercise());
  const [selectedCard, setSelectedCard] = useState<ExerciseCard | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExercises] = useState(10); // 10 exercises per level

  const handleCardClick = (card: ExerciseCard) => {
    if (showResult) return;

    setSelectedCard(card);
    setShowResult(true);

    // Check if answer is correct
    if (card.isCorrect) {
      setCorrectCount(prev => prev + 1);
      // Call progress callback for Level 1 tracking
      onProgress?.(1);
      // Play correct sound
      playCorrectSound();
    } else {
      // Play incorrect sound
      playIncorrectSound();
    }

    // Move to next exercise after a delay
    setTimeout(() => {
      if (correctCount + (card.isCorrect ? 1 : 0) >= totalExercises) {
        // Level completed
        onComplete(level.id);
      } else {
        // Next exercise
        setCurrentExercise(generateExercise());
        setSelectedCard(null);
        setShowResult(false);
      }
    }, 2000);
  };

  if (!currentExercise) {
    return <div>Loading exercise...</div>;
  }

  // For Level 1, show persistent progress; for other levels, show session progress
  const progress = level.id === 1
    ? Math.min((currentProgress / 100) * 100, 100) // Show persistent progress as percentage of 100
    : ((correctCount + (showResult && selectedCard?.isCorrect ? 1 : 0)) / totalExercises) * 100;

  return (
    <div className="exercise">
      <div className="exercise-header">
        <button className="back-button" onClick={onBack} title="Back to Levels">
          ❮
        </button>
        <h2>Level {level.id}: {level.name}</h2>
      </div>

      <div className="exercise-content">
        {questionText && (
          <div className="question">
            <h3>{questionText}</h3>
          </div>
        )}

        {/* Display the target prominently */}
        <div className="exercise-target">
          <div className="target-display">
            <div className="target-thai">{currentExercise.target.thai}</div>
            {currentExercise.target.english && showResult && selectedCard?.isCorrect && (
              <div className="target-english">{currentExercise.target.english}</div>
            )}
          </div>
        </div>

        <div className="cards-grid">
          {currentExercise.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => handleCardClick(card)}
              isSelected={selectedCard?.id === card.id}
              isCorrect={card.isCorrect}
              showResult={showResult}
              showPhonetic={showPhonetic} // Pass showPhonetic
            />
          ))}
        </div>

        {showResult && (
          <div className={`result ${selectedCard?.isCorrect ? 'correct' : 'incorrect'}`}>
            {selectedCard?.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </div>
        )}

        <ProgressBar
          progress={progress}
          current={correctCount + (showResult && selectedCard?.isCorrect ? 1 : 0)}
          total={totalExercises}
        />
      </div>
    </div>
  );
};
