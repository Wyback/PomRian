import React from 'react';
import type { ExerciseCard } from '../types';

interface ExtendedExerciseCard extends ExerciseCard {
  english?: string;
}

interface CardProps {
  card: ExerciseCard;
  onClick: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
  showPhonetic: boolean; // New prop for phonetic visibility
}

export const Card: React.FC<CardProps> = ({
  card,
  onClick,
  isSelected,
  isCorrect,
  showResult,
  showPhonetic, // Destructure new prop
}) => {
  const getCardClass = () => {
    let classes = 'card';
    if (isSelected) classes += ' selected';
    if (showResult) {
      if (isCorrect && isSelected) classes += ' correct';
      else if (!isCorrect && isSelected) classes += ' incorrect';
      else if (isCorrect && !isSelected) classes += ' correct-answer';
    }
    return classes;
  };

  return (
    <button
      className={getCardClass()}
      onClick={onClick}
      disabled={showResult}
    >
      {card.thai ? (
        <>
          <div className="thai-text">{card.thai}</div>
          {showPhonetic && <div className="phonetic-text">[{card.phonetic}]</div>}
        </>
      ) : (
        <>
          {showPhonetic && <div className="phonetic-only">[{card.phonetic}]</div>}
          {(card as ExtendedExerciseCard).english && (
            <div className="english-meaning">{(card as ExtendedExerciseCard).english}</div>
          )}
        </>
      )}
    </button>
  );
};
