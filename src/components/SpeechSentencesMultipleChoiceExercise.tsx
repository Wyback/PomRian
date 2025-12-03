import React, { useState, useEffect } from 'react';
import type { Exercise as ExerciseType, ExerciseCard, Level } from '../types';
import { generateSentences, type GeneratedSentence, playCorrectSound, playIncorrectSound } from '../services/llmService';
import { useThaiSpeech } from '../services/ttsService';
import { Card } from './Card';

interface SpeechSentencesMultipleChoiceExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  showPhonetic: boolean; // New prop for phonetic visibility
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const SpeechSentencesMultipleChoiceExercise: React.FC<SpeechSentencesMultipleChoiceExerciseProps> = ({
  level,
  onComplete,
  onBack,
  showPhonetic, // Destructure new prop
  onProgress,
  currentProgress = 0,
}) => {
  const [sentences, setSentences] = useState<GeneratedSentence[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [selectedCard, setSelectedCard] = useState<ExerciseCard | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExercises] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { speak, isPlaying, isSupported } = useThaiSpeech(currentExercise?.target.thai || '');

  useEffect(() => {
    const loadSentences = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedSentences = await generateSentences(30); // More sentences for variety
        setSentences(generatedSentences);
        const newExercise = generateSentenceExercise(generatedSentences);
        setCurrentExercise(newExercise);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sentences');
        console.error('Failed to load sentences:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSentences();
  }, [isSupported]);

  const generateSentenceExercise = (sentenceList: GeneratedSentence[]): ExerciseType => {
    if (sentenceList.length === 0) {
      throw new Error('No sentences available for exercise generation');
    }

    // Pick a random correct sentence
    const correctSentence = sentenceList[Math.floor(Math.random() * sentenceList.length)];

    // Get 3 wrong answers
    const wrongAnswers = sentenceList.filter(sentence => sentence.thai !== correctSentence.thai);
    const selectedWrongAnswers = wrongAnswers
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Create target (what the user needs to find) - listen to Thai sentence
    const target = {
      thai: correctSentence.thai,
      phonetic: correctSentence.phonetic,
    };

    // Create cards - show English and phonetic
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

  const handleCardClick = (card: ExerciseCard) => {
    if (showResult) return;

    setSelectedCard(card);
    setShowResult(true);

    // Check if answer is correct
    if (card.isCorrect) {
      setCorrectCount(prev => prev + 1);
      // Call progress callback for persistent tracking
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
        onComplete(level.id);
      } else {
        const newExercise = generateSentenceExercise(sentences);
        setCurrentExercise(newExercise);
        setSelectedCard(null);
        setShowResult(false);
      }
    }, 2500); // Slightly longer for sentences
  };

  if (loading) {
    return (
      <div className="exercise-loading">
        <div className="loading-spinner"></div>
        <p>🔊 Loading speech sentences...</p>
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
        <div className="speech-playback">
          {!isSupported && <p className="error-message">Speech synthesis not supported in your browser.</p>}
          <button onClick={speak} disabled={!isSupported || isPlaying} className="play-button">
            {isPlaying ? '⏸️' : '▶️'}
          </button>
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
              showPhonetic={showPhonetic}
            />
          ))}
        </div>

        {showResult && (
          <div className={`result ${selectedCard?.isCorrect ? 'correct' : 'incorrect'}`}>
            {selectedCard?.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
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