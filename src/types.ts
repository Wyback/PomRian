export interface ThaiCharacter {
  thai: string;
  phonetic: string;
  name: string;
}

export interface ExerciseCard {
  id: string;
  thai: string;
  phonetic: string;
  isCorrect: boolean;
  english?: string;
}

export interface ExerciseTarget {
  thai: string;
  phonetic: string;
  english?: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface Exercise {
  level: number;
  target: ExerciseTarget;
  cards: ExerciseCard[];
  correctAnswer: ExerciseCard;
  completed: boolean;
}

export interface UserProgress {
  currentLevel: number;
  levelProgress: Record<number, number>; // level -> progress (0-100)
  unlockedLevels: number[];
}
