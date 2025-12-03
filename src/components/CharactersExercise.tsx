import React from 'react';
import type { Exercise as ExerciseType, ExerciseCard, Level, ExerciseTarget } from '../types';
import { thaiConsonants, thaiVowels, getRandomWrongAnswers } from '../data/thaiData';
import { Exercise } from './Exercise';

interface CharactersExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const CharactersExercise: React.FC<CharactersExerciseProps> = ({
  level,
  onComplete,
  onBack,
  onProgress,
  currentProgress = 0,
}) => {
  const generateCharacterExercise = (): ExerciseType => {
    // Combine consonants and vowels
    const allCharacters = [...thaiConsonants, ...thaiVowels];

    // Pick a random correct character
    const correctCharacter = allCharacters[Math.floor(Math.random() * allCharacters.length)];

    // Get 3 wrong answers
    const wrongAnswers = getRandomWrongAnswers(correctCharacter, allCharacters, 3);

    // Create target (what the user needs to find)
    const target: ExerciseTarget = {
      thai: correctCharacter.thai,
      phonetic: correctCharacter.phonetic,
      english: correctCharacter.name,
    };

    // Create cards - only show phonetic transcriptions
    const cards: ExerciseCard[] = [
      {
        id: `correct-${correctCharacter.thai}`,
        thai: '', // Empty - only phonetic will be shown
        phonetic: correctCharacter.phonetic,
        isCorrect: true,
      },
      ...wrongAnswers.map((wrong, index) => ({
        id: `wrong-${index}-${wrong.thai}`,
        thai: '', // Empty - only phonetic will be shown
        phonetic: wrong.phonetic,
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

  return (
    <Exercise
      level={level}
      onComplete={onComplete}
      onBack={onBack}
      generateExercise={generateCharacterExercise}
      showPhonetic={true} // Always show phonetic for this exercise
      onProgress={onProgress}
      currentProgress={currentProgress}
    />
  );
};
