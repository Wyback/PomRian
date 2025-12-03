import React, { useState, useEffect } from 'react';
import type { Exercise as ExerciseType, Level } from '../types';
import { generateWords, type GeneratedWord, playCorrectSound, playIncorrectSound } from '../services/llmService';
import { useThaiSpeech } from '../services/ttsService';

interface SpeechWordsInputExerciseProps {
  level: Level;
  onComplete: (levelId: number) => void;
  onBack: () => void;
  showPhonetic: boolean; // New prop for phonetic visibility
  onProgress?: (correctAnswers: number) => void;
  currentProgress?: number;
}

export const SpeechWordsInputExercise: React.FC<SpeechWordsInputExerciseProps> = ({
  level,
  onComplete,
  onBack,
  showPhonetic, // Destructure new prop
  onProgress,
  currentProgress = 0,
}) => {
  const [words, setWords] = useState<GeneratedWord[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseType | null>(null);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalExercises] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { speak, isPlaying, isSupported } = useThaiSpeech(currentExercise?.target.thai || '');

  useEffect(() => {
    const loadWords = async () => {
      try {
        setLoading(true);
        setError(null);
        const generatedWords = await generateWords(50); // More words for variety
        setWords(generatedWords);
        const newExercise = generateWordExercise(generatedWords);
        setCurrentExercise(newExercise);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load words');
        console.error('Failed to load words:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [isSupported]);

  const generateWordExercise = (wordList: GeneratedWord[]): ExerciseType => {
    if (wordList.length === 0) {
      throw new Error('No words available for exercise generation');
    }

    const correctWord = wordList[Math.floor(Math.random() * wordList.length)];

    return {
      level: level.id,
      target: {
        thai: correctWord.thai,
        phonetic: correctWord.phonetic,
        english: correctWord.english,
      },
      cards: [], // Not used in input exercises
      correctAnswer: {
        id: 'correct',
        thai: '',
        phonetic: correctWord.phonetic,
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

    setTimeout(() => {
      if (correctCount + (correct ? 1 : 0) >= totalExercises) {
        onComplete(level.id);
      } else {
        const newExercise = generateWordExercise(words);
        setCurrentExercise(newExercise);
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
        <p>🔊 Loading speech words...</p>
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

        <div className="target-display">
          <div className="target-thai-large">{currentExercise.target.thai}</div>
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
            {isCorrect ? '✅ Correct!' : `❌ Incorrect! The correct answer is: ${showPhonetic ? currentExercise.target.phonetic : '[Hidden]'}`}
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