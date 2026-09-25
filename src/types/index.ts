export type SubjectId = 'math' | 'gk' | 'science' | 'history';

export interface Question {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}

export interface SubjectConfig {
  id: SubjectId;
  name: string;
  shortCode: string;
  tagline: string;
  description: string;
  themeColor: string;
  accentBorder: string;
  gradient: string;
  badgeBg: string;
  glowColor: string;
  buttonClass: string;
  iconName: 'Calculator' | 'Globe' | 'Atom' | 'Scroll';
  questionCount: number;
  maxScore: number;
}

export interface UserAnswer {
  questionId: number;
  questionText: string;
  options: [string, string, string, string];
  selectedOptionIndex: number;
  correctAnswerIndex: number;
  isCorrect: boolean;
  explanation: string;
  isTimedOut?: boolean;
  timeRemaining?: number;
}

export interface SubjectProgress {
  highScore: number;
  timesCompleted: number;
  bestStreak: number;
  lastPlayedAt?: string;
}

export type ProgressMap = Record<SubjectId, SubjectProgress>;
