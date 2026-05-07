import { Word, UserProgress, LearningRecord, Question } from './types';
import { levels, mockWords } from './wordDatabase';

const STORAGE_KEY = 'beidanci_progress';

let memoryStorage: Record<string, string> = {};

const setStorageItem = (key: string, value: string) => {
  try {
    memoryStorage[key] = value;
  } catch (e) {
    console.warn('Failed to set storage:', e);
  }
};

const getStorageItem = (key: string): string | null => {
  try {
    if (memoryStorage[key]) {
      return memoryStorage[key];
    }
  } catch (e) {
    console.warn('Failed to get storage:', e);
  }
  return null;
};

export const loadProgress = (): UserProgress => {
  try {
    const stored = getStorageItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to load progress:', e);
  }
  return getInitialProgress();
};

export const saveProgress = (progress: UserProgress) => {
  try {
    setStorageItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Failed to save progress:', e);
  }
};

export const getInitialProgress = (): UserProgress => ({
  currentLevel: 1,
  completedWords: [],
  masteredRoots: [],
  learningHistory: [],
  streak: 0,
  totalScore: 0,
});

export const calculateNextReviewDate = (wordId: number, progress: UserProgress): Date => {
  const history = progress.learningHistory.filter(h => h.wordsLearned > 0);
  if (history.length === 0) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  const wordReviews = progress.learningHistory.filter(h => 
    h.wordsLearned > 0 && Math.random() > 0.3
  ).length;
  
  const intervals = [1, 2, 4, 7, 14, 30, 60];
  const intervalIndex = Math.min(wordReviews, intervals.length - 1);
  const interval = intervals[intervalIndex];
  
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  return nextDate;
};

export const getTodayWords = (progress: UserProgress): Word[] => {
  const currentLevel = levels[progress.currentLevel - 1];
  const dailyTarget = Math.ceil(currentLevel.targetWords / 30);
  
  const completedToday = progress.learningHistory.find(
    h => h.date === new Date().toISOString().split('T')[0]
  )?.wordsLearned || 0;
  
  const remainingToday = dailyTarget - completedToday;
  
  const availableWords = mockWords.filter(w => 
    w.level <= progress.currentLevel && 
    !progress.completedWords.includes(w.id)
  );
  
  const sortedWords = availableWords.sort((a, b) => b.frequency - a.frequency);
  
  return sortedWords.slice(0, remainingToday);
};

export const getReviewWords = (progress: UserProgress): Word[] => {
  const today = new Date();
  const reviewWords: Word[] = [];
  
  progress.completedWords.forEach(wordId => {
    const reviewDate = calculateNextReviewDate(wordId, progress);
    if (reviewDate <= today) {
      const word = mockWords.find(w => w.id === wordId);
      if (word) {
        reviewWords.push(word);
      }
    }
  });
  
  return reviewWords.slice(0, 10);
};

export const generateQuestions = (words: Word[], count: number = 6): Question[] => {
  const questions: Question[] = [];
  
  const usedWordIds = new Set<number>();
  
  for (let i = 0; i < count && i < words.length; i++) {
    const word = words[i];
    if (usedWordIds.has(word.id)) continue;
    usedWordIds.add(word.id);
    
    const root = word.morphemes.find(m => m.type === 'root');
    if (!root) continue;
    
    const distractors = mockWords
      .filter(w => w.id !== word.id && w.level <= word.level)
      .slice(0, 3)
      .map(w => ({ text: w.word, isCorrect: false }));
    
    const options = [...distractors, { text: word.word, isCorrect: true }]
      .sort(() => Math.random() - 0.5);
    
    questions.push({
      id: i + 1,
      question: `哪个单词含有词根 ${root.text} (${root.meaning})？`,
      options,
      explanation: `${word.word} = ${word.morphemes.map(m => `${m.text}(${m.meaning})`).join(' + ')} → ${word.meaning}`,
      level: word.level,
    });
  }
  
  return questions;
};

export const updateProgress = (
  progress: UserProgress,
  wordsLearned: Word[],
  score: number,
  timeSpent: number
): UserProgress => {
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = progress.learningHistory.find(h => h.date === today);
  
  const newCompletedWords = [...new Set([...progress.completedWords, ...wordsLearned.map(w => w.id)])];
  
  const newHistory = todayRecord
    ? progress.learningHistory.map(h =>
        h.date === today
          ? { ...h, wordsLearned: h.wordsLearned + wordsLearned.length, score: h.score + score, timeSpent: h.timeSpent + timeSpent }
          : h
      )
    : [...progress.learningHistory, { date: today, wordsLearned: wordsLearned.length, score, timeSpent }];
  
  const newStreak = calculateStreak(newHistory);
  const newTotalScore = progress.totalScore + score;
  
  const currentLevelData = levels[progress.currentLevel - 1];
  const nextLevelData = levels[progress.currentLevel];
  let newLevel = progress.currentLevel;
  
  if (nextLevelData && newCompletedWords.length >= nextLevelData.targetWords) {
    newLevel = progress.currentLevel + 1;
  }
  
  const newMasteredRoots = [...new Set([...progress.masteredRoots, ...wordsLearned.flatMap(w => w.roots)])];
  
  return {
    ...progress,
    currentLevel: newLevel,
    completedWords: newCompletedWords,
    masteredRoots: newMasteredRoots,
    learningHistory: newHistory,
    streak: newStreak,
    totalScore: newTotalScore,
  };
};

const calculateStreak = (history: LearningRecord[]): number => {
  if (history.length === 0) return 0;
  
  const sortedHistory = [...history].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < sortedHistory.length; i++) {
    const recordDate = new Date(sortedHistory[i].date);
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (
      recordDate.getDate() === expectedDate.getDate() &&
      recordDate.getMonth() === expectedDate.getMonth() &&
      recordDate.getFullYear() === expectedDate.getFullYear()
    ) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export const getLevelProgress = (progress: UserProgress) => {
  const currentLevel = levels[progress.currentLevel - 1];
  const nextLevel = levels[progress.currentLevel];
  
  const wordsInLevel = mockWords.filter(w => w.level <= progress.currentLevel).length;
  const completedInLevel = progress.completedWords.filter(id => {
    const word = mockWords.find(w => w.id === id);
    return word && word.level <= progress.currentLevel;
  }).length;
  
  const percentage = wordsInLevel > 0 ? Math.min((completedInLevel / wordsInLevel) * 100, 100) : 0;
  
  return {
    currentLevel,
    nextLevel,
    progress: percentage,
    completed: completedInLevel,
    total: wordsInLevel,
  };
};
