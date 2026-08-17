import { UserStats, UserSettings } from './types';

const STATS_KEY = 'quizmaster_user_stats_v1';
const SETTINGS_KEY = 'quizmaster_user_settings_v1';

export const DEFAULT_STATS: UserStats = {
  totalQuizzesTaken: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  currentStreak: 1,
  longestStreak: 1,
  categoryScores: {},
  bookmarkedQuestionIds: [],
  history: []
};

export const DEFAULT_SETTINGS: UserSettings = {
  apiKey: '',
  aiProvider: 'built-in',
  soundEnabled: true,
  timerDurationSeconds: 30,
  darkMode: true
};

export function getUserStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : DEFAULT_STATS;
  } catch (e) {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to local storage:', e);
  }
}

export function getUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function recordQuizCompletion(
  quizTitle: string,
  category: string,
  score: number,
  total: number
): UserStats {
  const current = getUserStats();
  const updatedHistory = [
    {
      id: `hist-${Date.now()}`,
      title: quizTitle,
      category,
      score,
      total,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    ...current.history
  ].slice(0, 50);

  const prevCat = current.categoryScores[category] || { total: 0, correct: 0 };
  const updatedCatScores = {
    ...current.categoryScores,
    [category]: {
      total: prevCat.total + total,
      correct: prevCat.correct + score
    }
  };

  const updated: UserStats = {
    ...current,
    totalQuizzesTaken: current.totalQuizzesTaken + 1,
    totalQuestionsAnswered: current.totalQuestionsAnswered + total,
    totalCorrect: current.totalCorrect + score,
    currentStreak: Math.max(1, current.currentStreak + 1),
    longestStreak: Math.max(current.longestStreak, current.currentStreak + 1),
    categoryScores: updatedCatScores,
    history: updatedHistory
  };

  saveUserStats(updated);
  return updated;
}

export function toggleBookmarkQuestion(questionId: string): boolean {
  const current = getUserStats();
  const exists = current.bookmarkedQuestionIds.includes(questionId);
  const updatedIds = exists
    ? current.bookmarkedQuestionIds.filter(id => id !== questionId)
    : [...current.bookmarkedQuestionIds, questionId];

  saveUserStats({ ...current, bookmarkedQuestionIds: updatedIds });
  return !exists;
}
