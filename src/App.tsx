import { useState } from 'react';
import type { Level, UserProgress } from './types';
import { generateLLMContent, isLLMContentAvailable, regenerateWords, regenerateSentences, regenerateQuestions } from './services/llmService';
import { LevelSelector } from './components/LevelSelector';
// Exercise components
import { CharactersExercise } from './components/exercises/CharactersExercise';
import { CharactersAdvancedExercise } from './components/exercises/CharactersAdvancedExercise';
import { WordsMultipleChoiceExercise } from './components/exercises/WordsMultipleChoiceExercise';
import { WordsExercise } from './components/exercises/WordsExercise';
import { SentencesMultipleChoiceExercise } from './components/exercises/SentencesMultipleChoiceExercise';
import { SentencesAdvancedExercise } from './components/exercises/SentencesAdvancedExercise';
import { SpeechWordsMultipleChoiceExercise } from './components/exercises/SpeechWordsMultipleChoiceExercise';
import { SpeechWordsInputExercise } from './components/exercises/SpeechWordsInputExercise';
import { SpeechSentencesMultipleChoiceExercise } from './components/exercises/SpeechSentencesMultipleChoiceExercise';
import { SpeechSentencesInputExercise } from './components/exercises/SpeechSentencesInputExercise';
import { SpeechQuestionsMultipleChoiceExercise } from './components/exercises/SpeechQuestionsMultipleChoiceExercise';
import { SpeechQuestionsInputExercise } from './components/exercises/SpeechQuestionsInputExercise';
import { SettingsModal } from './components/SettingsModal';
import './App.css';

const LEVELS: Level[] = [
  {
    id: 1,
    name: '📝 Characters',
    description: 'Multiple choice - Learn Thai letters & sounds',
    unlocked: true,
  },
  {
    id: 2,
    name: '🔥 Advanced: Characters',
    description: 'Type phonetic transcription for Thai characters',
    unlocked: true,
  },
  {
    id: 3,
    name: '📚 Words',
    description: 'Multiple choice - Learn Thai vocabulary',
    unlocked: true,
  },
  {
    id: 4,
    name: '🎯 Advanced: Words',
    description: 'Type phonetic transcription for Thai words',
    unlocked: true,
  },
  {
    id: 5,
    name: '💬 Sentences',
    description: 'Multiple choice - Learn Thai sentence structure',
    unlocked: true,
  },
  {
    id: 6,
    name: '🚀 Advanced: Sentences',
    description: 'Type phonetic transcription for Thai sentences',
    unlocked: true,
  },
  {
    id: 7,
    name: '🗣️ Speech Words',
    description: 'Listen and choose the correct English/phonetic for words',
    unlocked: true,
  },
  {
    id: 8,
    name: '🎤 Advanced: Speech Words',
    description: 'Listen and type the phonetic transcription for words',
    unlocked: true,
  },
  {
    id: 9,
    name: '👂 Speech Sentences',
    description: 'Listen and choose the correct English/phonetic for sentences',
    unlocked: true,
  },
  {
    id: 10,
    name: '✍️Advanced: Speech Sentences',
    description: 'Listen and type the phonetic transcription for sentences',
    unlocked: true,
  },
  {
    id: 11,
    name: '🗣️ Speech Questions',
    description: 'Listen to daily life questions and choose the correct answer',
    unlocked: true,
  },
  {
    id: 12,
    name: '🎤 Advanced: Speech Questions',
    description: 'Listen to daily life questions and type the correct answer',
    unlocked: true,
  },
];

function App() {
  const [currentView, setCurrentView] = useState<'levels' | 'exercise'>('levels');
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    currentLevel: 1,
    levelProgress: {},
    unlockedLevels: [1, 2], // Only unlock character levels initially
  });
  const [persistentLevelProgress, setPersistentLevelProgress] = useState(() => {
    const saved = localStorage.getItem('persistentLevelProgress');
    return saved ? JSON.parse(saved) : {};
  });
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [contentGenerationError, setContentGenerationError] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [regeneratingLevels, setRegeneratingLevels] = useState<Set<number>>(new Set());

  const togglePhoneticVisibility = () => {
    setShowPhonetic(prev => !prev);
  };

  const updateLevelProgress = (levelId: number, increment: number) => {
    setPersistentLevelProgress((prev: Record<number, number>) => {
      const newProgress = {
        ...prev,
        [levelId]: (prev[levelId] || 0) + increment
      };
      localStorage.setItem('persistentLevelProgress', JSON.stringify(newProgress));
      return newProgress;
    });
  };

  const handleGenerateLLMContent = async () => {
    if (isGeneratingContent || isLLMContentAvailable()) return;

    setIsGeneratingContent(true);
    setContentGenerationError(null);

    try {
      await generateLLMContent();

      // Reset progress for levels that use regenerated content
      setPersistentLevelProgress((prev: Record<number, number>) => {
        const newProgress = { ...prev };
        // Reset progress for levels that use LLM-generated content (3+)
        [3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach(levelId => {
          delete newProgress[levelId];
        });
        localStorage.setItem('persistentLevelProgress', JSON.stringify(newProgress));
        return newProgress;
      });

      // Unlock all levels that require LLM content after successful generation
      setUserProgress(prev => ({
        ...prev,
        unlockedLevels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      }));

    } catch (error) {
      setContentGenerationError(error instanceof Error ? error.message : 'Failed to generate content');
      console.error('Failed to generate LLM content:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const handleLevelSelect = (levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (level && level.unlocked) {
      setSelectedLevel(level);
      setCurrentView('exercise');
    }
  };

  const handleLevelComplete = (levelId: number) => {
    setUserProgress(prev => {
      const newProgress = { ...prev };
      newProgress.levelProgress[levelId] = 100;

      // Unlock next level
      const nextLevelId = levelId + 1;
      if (nextLevelId <= LEVELS.length && !newProgress.unlockedLevels.includes(nextLevelId)) {
        newProgress.unlockedLevels.push(nextLevelId);
        LEVELS[nextLevelId - 1].unlocked = true;
      }

      newProgress.currentLevel = Math.max(newProgress.currentLevel, levelId);
      return newProgress;
    });

    setCurrentView('levels');
    setSelectedLevel(null);
  };

  const handleLevelProgress = (levelId: number, correctAnswers: number) => {
    // Update persistent progress for the specified level
    updateLevelProgress(levelId, correctAnswers);
  };

  const handleRegenerateLevel = async (levelId: number) => {
    if (regeneratingLevels.has(levelId) || !isLLMContentAvailable()) return;

    setRegeneratingLevels(prev => new Set(prev).add(levelId));

    try {
      // Determine which content to regenerate based on level
      if (levelId === 3 || levelId === 4 || levelId === 7 || levelId === 8) {
        // Words-based levels
        await regenerateWords();
      } else if (levelId === 5 || levelId === 6 || levelId === 9 || levelId === 10) {
        // Sentences-based levels
        await regenerateSentences();
      } else if (levelId === 11 || levelId === 12) {
        // Questions-based levels
        await regenerateQuestions();
      }

      // Reset progress for the regenerated level
      setPersistentLevelProgress((prev: Record<number, number>) => {
        const newProgress = { ...prev };
        delete newProgress[levelId];
        localStorage.setItem('persistentLevelProgress', JSON.stringify(newProgress));
        return newProgress;
      });

    } catch (error) {
      console.error(`Failed to regenerate Level ${levelId} content:`, error);
    } finally {
      setRegeneratingLevels(prev => {
        const newSet = new Set(prev);
        newSet.delete(levelId);
        return newSet;
      });
    }
  };

  const isLevelRegenerating = (levelId: number): boolean => {
    return regeneratingLevels.has(levelId);
  };

  const handleBackToLevels = () => {
    setCurrentView('levels');
    setSelectedLevel(null);
  };

  const renderExercise = () => {
    if (!selectedLevel) return null;

    const exerciseProps = {
      level: selectedLevel,
      onComplete: handleLevelComplete,
      onBack: handleBackToLevels,
      showPhonetic: showPhonetic, // Pass showPhonetic prop
    };

    switch (selectedLevel.id) {
      case 1:
        return <CharactersExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(1, correct)} currentProgress={persistentLevelProgress[1] || 0} />;
      case 2:
        return <CharactersAdvancedExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(2, correct)} currentProgress={persistentLevelProgress[2] || 0} />;
      case 3:
        return <WordsMultipleChoiceExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(3, correct)} currentProgress={persistentLevelProgress[3] || 0} />;
      case 4:
        return <WordsExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(4, correct)} currentProgress={persistentLevelProgress[4] || 0} />;
      case 5:
        return <SentencesMultipleChoiceExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(5, correct)} currentProgress={persistentLevelProgress[5] || 0} />;
      case 6:
        return <SentencesAdvancedExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(6, correct)} currentProgress={persistentLevelProgress[6] || 0} />;
      case 7:
        return <SpeechWordsMultipleChoiceExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(7, correct)} currentProgress={persistentLevelProgress[7] || 0} />;
      case 8:
        return <SpeechWordsInputExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(8, correct)} currentProgress={persistentLevelProgress[8] || 0} />;
      case 9:
        return <SpeechSentencesMultipleChoiceExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(9, correct)} currentProgress={persistentLevelProgress[9] || 0} />;
      case 10:
        return <SpeechSentencesInputExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(10, correct)} currentProgress={persistentLevelProgress[10] || 0} />;
      case 11:
        return <SpeechQuestionsMultipleChoiceExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(11, correct)} currentProgress={persistentLevelProgress[11] || 0} />;
      case 12:
        return <SpeechQuestionsInputExercise {...exerciseProps} onProgress={(correct) => handleLevelProgress(12, correct)} currentProgress={persistentLevelProgress[12] || 0} />;
      default:
        return null;
    }
  };

  const updatedLevels = LEVELS.map(level => {
    const isUnlocked = userProgress.unlockedLevels.includes(level.id);
    let progress = 0;

    if (isUnlocked) {
      // All levels: persistent progress based on correct answers
      const correctAnswers = persistentLevelProgress[level.id] || 0;
      progress = Math.min((correctAnswers / 100) * 100, 100);
    }

    return {
      ...level,
      unlocked: isUnlocked,
      progress,
    };
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍊 PomRian - Learn Thai</h1>
        <button
          className="settings-button"
          onClick={() => setIsSettingsModalOpen(true)}
          title="Settings"
        >
          ⚙️
        </button>
      </header>

      <main className="app-main">
        {currentView === 'levels' ? (
          <LevelSelector
            levels={updatedLevels}
            onLevelSelect={handleLevelSelect}
            onRegenerate={handleRegenerateLevel}
            isRegenerating={isLevelRegenerating}
          />
        ) : (
          renderExercise()
        )}
      </main>

      <footer className="app-footer">
        <p>🚀 Made by Omnubik - Learn Thai for Free</p>
      </footer>

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onGenerateLLMContent={handleGenerateLLMContent}
        isGeneratingContent={isGeneratingContent}
        showPhonetic={showPhonetic}
        onTogglePhonetic={togglePhoneticVisibility}
        contentGenerationError={contentGenerationError}
      />
    </div>
  );
}

export default App;