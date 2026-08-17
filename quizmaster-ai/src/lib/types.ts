export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type GameMode = 'standard' | 'timed' | 'survival' | 'flashcard';

export interface Question {
  id: string;
  category: string;
  subCategory?: string;
  topic?: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
  difficulty: Difficulty;
  isOfficial?: boolean; // Official fact vs unofficial/myth
  mythExplanation?: string;
  tags?: string[];
  sourceUrl?: string; // Wikipedia or doc link if available
}

export interface QuizSession {
  id: string;
  title: string;
  category: string;
  mode: GameMode;
  questions: Question[];
  currentStep: number;
  userAnswers: (number | null)[];
  timeSpentSeconds: number;
  score: number;
  completed: boolean;
  timestamp: number;
  livesRemaining?: number;
}

export interface InterviewScenario {
  id: string;
  role: string; // e.g. "Senior Frontend Engineer", "Product Manager", "System Design Architect", "HR / Behavioral"
  topic: string;
  question: string;
  context?: string;
  evaluationCriteria: string[];
  keyPoints: string[];
  sampleModelAnswer: string;
  difficulty: Difficulty;
}

export interface InterviewEvaluation {
  score: number; // 0 - 100
  feedback: string;
  keyPointsCovered: string[];
  missingPoints: string[];
  strengths: string[];
  improvements: string[];
  suggestedAnswer: string;
}

export interface WikipediaArticle {
  pageid: number;
  title: string;
  extract: string;
  description?: string;
  thumbnailUrl?: string;
  contentUrl?: string;
}

export interface UserStats {
  totalQuizzesTaken: number;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  currentStreak: number;
  longestStreak: number;
  categoryScores: Record<string, { total: number; correct: number }>;
  bookmarkedQuestionIds: string[];
  history: Array<{
    id: string;
    title: string;
    category: string;
    score: number;
    total: number;
    date: string;
  }>;
}

export interface UserSettings {
  apiKey?: string;
  aiProvider: 'built-in' | 'openai' | 'gemini';
  soundEnabled: boolean;
  timerDurationSeconds: number; // default 30s per question
  darkMode: boolean;
}
