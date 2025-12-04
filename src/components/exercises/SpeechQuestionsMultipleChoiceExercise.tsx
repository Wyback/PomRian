import React, { useState, useEffect } from 'react';
import type { Exercise as ExerciseType, ExerciseCard, Level } from '../../types';
import { generateDailyLifeQuestions, type GeneratedQuestion } from '../../services/llmService';
import { playCorrectSound, playIncorrectSound } from '../../services/soundService';
import { useThaiSpeech } from '../../services/ttsService';
import { Card } from '../Card';

interface SpeechQuestionsMultipleChoiceExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  showPhonetic: boolean; // New prop for phonetic visibility
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const SpeechQuestionsMultipleChoiceExercise: React.FC<SpeechQuestionsMultipleChoiceExerciseProps> = ({
  level,
  onComplete,
  onBack,
  showPhonetic, // Destructure new prop
  onProgress,
  currentProgress = 0,
}) => {
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [selectedCard, setSelectedCard] = useState<ExerciseCard | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExercises] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { speak, isPlaying, isSupported } = useThaiSpeech(currentExercise?.target.thai || '');

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedQuestions = await generateDailyLifeQuestions(30); // More questions for variety
        setQuestions(generatedQuestions);
        const newExercise = generateQuestionExercise(generatedQuestions);
        setCurrentExercise(newExercise);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
        console.error('Failed to load questions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [isSupported]);

  const generateQuestionExercise = (questionList: GeneratedQuestion[]): ExerciseType => {
    if (questionList.length === 0) {
      throw new Error('No questions available for exercise generation');
    }

    const correctQuestion = questionList[Math.floor(Math.random() * questionList.length)];

    const wrongAnswers = questionList.filter(question => question.thai !== correctQuestion.thai);
    const selectedWrongAnswers = wrongAnswers
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const target = {
      thai: correctQuestion.thai,
      phonetic: correctQuestion.phonetic,
    };

    const cards: ExerciseCard[] = [
      {
        id: `correct-${correctQuestion.thai}`,
        thai: '',
        phonetic: correctQuestion.phoneticAnswer,
        english: correctQuestion.englishAnswer,
        isCorrect: true,
      },
      ...selectedWrongAnswers.map((wrong, index) => ({
        id: `wrong-${index}-${wrong.thai}`,
        thai: '',
        phonetic: wrong.phoneticAnswer,
        english: wrong.englishAnswer,
        isCorrect: false,
      })),
    ];

    const shuffledCards = cards.sort(() => Math.random() - 0.5);

    return {
      level: level.id,
      target,
      cards: shuffledCards,
      correctAnswer: cards.find(card => card.isCorrect)!,
      completed: false,
    };
  };

  const handleCardClick = (card: ExerciseCard) => {
    if (showResult) return;

    setSelectedCard(card);
    setShowResult(true);

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

    setTimeout(() => {
      if (correctCount + (card.isCorrect ? 1 : 0) >= totalExercises) {
        onComplete(level.id);
      } else {
        const newExercise = generateQuestionExercise(questions);
        setCurrentExercise(newExercise);
        setSelectedCard(null);
        setShowResult(false);
      }
    }, 2500);
  };

  if (loading) {
    return (
      <div className="exercise-loading">
        <div className="loading-spinner"></div>
        <p>🔊 Loading daily life questions...</p>
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
