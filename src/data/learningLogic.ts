import {
  Word, UserProgress, LearningRecord, Question,
  WordReviewData, StudyPlan, DailyMission, SessionStep,
} from './types';
import { levels, allWords, coreRoots, getWordsByRoot } from './wordDatabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAuth } from './authService';

const LEGACY_KEY = 'beidanci_progress_v2';
const KEY_PREFIX = 'beidanci_progress_';
const TOTAL_WORDS = allWords.length;

// Storage key per user (phone-based), fallback to legacy key
const getStorageKey = (phone?: string): string =>
  phone ? KEY_PREFIX + phone : LEGACY_KEY;

// ==================== Persistence ====================

export const loadProgress = async (): Promise<UserProgress> => {
  try {
    const user = await loadAuth();
    const key = getStorageKey(user?.phone);
    const stored = await AsyncStorage.getItem(key);

    if (stored) return JSON.parse(stored);

    // Migrate: if user-specific key is empty but legacy key has data, migrate it
    if (user?.phone) {
      const legacy = await AsyncStorage.getItem(LEGACY_KEY);
      if (legacy) {
        await AsyncStorage.setItem(key, legacy);
        await AsyncStorage.removeItem(LEGACY_KEY);
        return JSON.parse(legacy);
      }
    }
  } catch (e) {
    // silent fail, return default progress
  }
  return getInitialProgress();
};

export const saveProgress = async (progress: UserProgress): Promise<void> => {
  try {
    const user = await loadAuth();
    const key = getStorageKey(user?.phone);
    await AsyncStorage.setItem(key, JSON.stringify(progress));
  } catch (e) {
    // silent fail
  }
};

export const getInitialProgress = (): UserProgress => ({
  currentLevel: 1,
  completedWords: [],
  masteredRoots: [],
  learningHistory: [],
  streak: 0,
  totalScore: 0,
  wordReviews: {},
  studyPlan: null,
  todayMission: null,
  learnedRootIds: [],
});

// ==================== Study Plan ====================

export const createStudyPlan = (wordsPerDay: number): StudyPlan => {
  const today = new Date().toISOString().split('T')[0];
  return {
    wordsPerDay,
    totalDays: Math.ceil(TOTAL_WORDS / wordsPerDay),
    startDate: today,
    currentDay: 1,
  };
};

export const getEstimatedDays = (wordsPerDay: number): number =>
  Math.ceil(TOTAL_WORDS / wordsPerDay);

// ==================== Daily Mission Generation ====================

const ROOTS_PER_SESSION = 2;

export const generateDailyMission = (progress: UserProgress): DailyMission => {
  const today = new Date().toISOString().split('T')[0];
  const plan = progress.studyPlan;
  const wordsPerDay = plan?.wordsPerDay || 25;

  // -- Pick roots to teach today (not yet learned) --
  const unlearnedRoots = coreRoots.filter(r => !progress.learnedRootIds.includes(r.id));
  const todayRoots = unlearnedRoots.slice(0, ROOTS_PER_SESSION);
  const todayRootIds = todayRoots.map(r => r.id);

  // -- Pick new words: prioritize words from today's roots --
  const completedSet = new Set(progress.completedWords);
  let newWordIds: number[] = [];

  // Words from today's new roots
  for (const rootId of todayRootIds) {
    const rootWords = getWordsByRoot(rootId).filter(w => !completedSet.has(w.id));
    newWordIds.push(...rootWords.map(w => w.id));
  }

  // If not enough, add words from already-learned roots
  if (newWordIds.length < wordsPerDay) {
    const remaining = wordsPerDay - newWordIds.length;
    const addedSet = new Set(newWordIds);
    const moreWords = allWords
      .filter(w => !completedSet.has(w.id) && !addedSet.has(w.id))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, remaining);
    newWordIds.push(...moreWords.map(w => w.id));
  }

  newWordIds = newWordIds.slice(0, wordsPerDay);

  // -- Pick review words (SM-2 due) --
  const reviewWordIds = getReviewWordIds(progress, 20);

  return {
    date: today,
    newRoots: todayRootIds,
    newWordIds,
    reviewWordIds,
    completedNewWords: [],
    completedReviews: [],
    quizDone: false,
  };
};

export const getTodayMission = (progress: UserProgress): DailyMission => {
  const today = new Date().toISOString().split('T')[0];

  if (progress.todayMission && progress.todayMission.date === today) {
    return progress.todayMission;
  }

  return generateDailyMission(progress);
};

// Generate a fresh batch when the current mission is fully done
export const generateNextBatch = (progress: UserProgress): DailyMission => {
  return generateDailyMission(progress);
};

// ==================== Session Builder ====================

export const buildLearningSession = (
  mission: DailyMission,
  progress: UserProgress,
): SessionStep[] => {
  const steps: SessionStep[] = [];

  // Step 1: Introduce today's new roots
  for (const rootId of mission.newRoots) {
    if (!progress.learnedRootIds.includes(rootId)) {
      steps.push({ type: 'root-intro', rootId });
    }
  }

  // Step 2: Learn new words (from those roots first, then others)
  const remaining = mission.newWordIds.filter(
    id => !mission.completedNewWords.includes(id),
  );
  for (const wordId of remaining.slice(0, 15)) {
    steps.push({ type: 'word-learn', wordId });
  }

  // Step 3: Quick quiz on what was just learned
  const quizWords = remaining.slice(0, 8).map(id => allWords.find(w => w.id === id)).filter(Boolean) as Word[];
  if (quizWords.length >= 3 && !mission.quizDone) {
    const questions = generateQuestions(quizWords, Math.min(6, quizWords.length));
    if (questions.length > 0) {
      steps.push({ type: 'quiz', questions });
    }
  }

  // Step 4: Review due words
  const reviewRemaining = mission.reviewWordIds.filter(
    id => !mission.completedReviews.includes(id),
  );
  for (const wordId of reviewRemaining.slice(0, 10)) {
    steps.push({ type: 'review-card', wordId });
  }

  // Step 5: Complete
  steps.push({ type: 'complete' });

  return steps;
};

// ==================== SM-2 Spaced Repetition ====================

const SM2_MIN_EASE = 1.3;
const SM2_DEFAULT_EASE = 2.5;

export const calculateNextReview = (
  review: WordReviewData | undefined,
  quality: number,
): WordReviewData => {
  const now = todayStr();

  if (!review) {
    const interval = quality >= 3 ? 1 : 0;
    return {
      wordId: 0, easeFactor: SM2_DEFAULT_EASE, interval,
      repetitions: quality >= 3 ? 1 : 0,
      nextReview: addDays(now, interval), lastReview: now,
    };
  }

  let { easeFactor, interval, repetitions } = review;
  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 3;
    else interval = Math.round(interval * easeFactor);
    repetitions++;
  } else {
    repetitions = 0;
    interval = 0;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(SM2_MIN_EASE, easeFactor);

  return {
    wordId: review.wordId, easeFactor, interval, repetitions,
    nextReview: addDays(now, interval), lastReview: now,
  };
};

const getReviewWordIds = (progress: UserProgress, limit: number): number[] => {
  const today = todayStr();
  const due: { id: number; urgency: string; ease: number }[] = [];

  Object.values(progress.wordReviews).forEach(r => {
    if (r.nextReview <= today) {
      due.push({ id: r.wordId, urgency: r.nextReview, ease: r.easeFactor });
    }
  });

  due.sort((a, b) => a.urgency.localeCompare(b.urgency) || a.ease - b.ease);
  return due.slice(0, limit).map(d => d.id);
};

export const getReviewWords = (progress: UserProgress): Word[] => {
  const ids = getReviewWordIds(progress, 30);
  return ids.map(id => allWords.find(w => w.id === id)).filter(Boolean) as Word[];
};

// All learned words for free practice (not limited by SM-2 schedule)
export const getLearnedWords = (progress: UserProgress): Word[] => {
  return progress.completedWords
    .map(id => allWords.find(w => w.id === id))
    .filter(Boolean) as Word[];
};

// ==================== Question Generation ====================

export const generateQuestions = (words: Word[], count: number = 6): Question[] => {
  const questions: Question[] = [];
  const shuffled = [...words].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const word = shuffled[i];
    const qType = i % 3;

    if (qType === 0) {
      const distractors = allWords
        .filter(w => w.id !== word.id && w.level <= word.level + 1)
        .sort(() => Math.random() - 0.5).slice(0, 3)
        .map(w => ({ text: w.meaning, isCorrect: false }));
      const options = [...distractors, { text: word.meaning, isCorrect: true }]
        .sort(() => Math.random() - 0.5);

      questions.push({
        id: i + 1, type: 'word-meaning',
        question: `"${word.word}" 的意思是？`, options,
        explanation: word.morphemes.length > 1
          ? `${word.word} = ${word.morphemes.map(m => `${m.text}(${m.meaning})`).join(' + ')} = ${word.meaning}`
          : `${word.word} 的意思是 ${word.meaning}`,
        level: word.level, wordId: word.id,
      });
    } else if (qType === 1 && word.rootId) {
      const root = coreRoots.find(r => r.id === word.rootId);
      if (!root) continue;
      const distractors = coreRoots
        .filter(r => r.id !== root.id).sort(() => Math.random() - 0.5)
        .slice(0, 3).map(r => ({ text: r.meaning, isCorrect: false }));
      const options = [...distractors, { text: root.meaning, isCorrect: true }]
        .sort(() => Math.random() - 0.5);

      questions.push({
        id: i + 1, type: 'root-meaning',
        question: `词根 "${root.root}" 的含义是？`, options,
        explanation: `"${root.root}" 来自${root.origin}，意思是"${root.meaning}"。如：${root.words.slice(0, 3).map(w => `${w.word}(${w.meaning})`).join('、')}`,
        level: word.level,
      });
    } else {
      const rootId = word.rootId;
      if (!rootId) { continue; }
      const sameRoot = allWords.filter(w => w.rootId === rootId && w.id !== word.id);
      if (sameRoot.length === 0) { continue; }
      const target = sameRoot[Math.floor(Math.random() * sameRoot.length)];
      const distractors = allWords
        .filter(w => w.rootId !== rootId && w.rootId)
        .sort(() => Math.random() - 0.5).slice(0, 3)
        .map(w => ({ text: w.word, isCorrect: false }));
      const options = [...distractors, { text: target.word, isCorrect: true }]
        .sort(() => Math.random() - 0.5);

      questions.push({
        id: i + 1, type: 'morpheme-match',
        question: `哪个单词和 "${word.word}" 有相同的词根？`, options,
        explanation: `${word.word} 和 ${target.word} 都包含词根 "${rootId}"`,
        level: word.level, wordId: word.id,
      });
    }
  }
  return questions;
};

// Generate review exercises: more question types for deeper recall
export const generateReviewQuestions = (words: Word[], count: number = 10): Question[] => {
  const questions: Question[] = [];
  const shuffled = [...words].sort(() => Math.random() - 0.5);

  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const word = shuffled[i];
    // Cycle through 5 question types for variety
    const qType = (i + word.id) % 5;

    if (qType === 0) {
      // English -> Chinese meaning
      const distractors = allWords
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5).slice(0, 3)
        .map(w => ({ text: w.meaning, isCorrect: false }));
      questions.push({
        id: i + 1, type: 'word-meaning',
        question: `"${word.word}" 的意思是？`,
        options: [...distractors, { text: word.meaning, isCorrect: true }].sort(() => Math.random() - 0.5),
        explanation: `${word.word} 的意思是 ${word.meaning}`,
        level: word.level, wordId: word.id,
      });
    } else if (qType === 1) {
      // Chinese -> English (reverse)
      const distractors = allWords
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5).slice(0, 3)
        .map(w => ({ text: w.word, isCorrect: false }));
      questions.push({
        id: i + 1, type: 'word-meaning',
        question: `哪个单词的意思是"${word.meaning}"？`,
        options: [...distractors, { text: word.word, isCorrect: true }].sort(() => Math.random() - 0.5),
        explanation: `${word.meaning} 对应的单词是 ${word.word}`,
        level: word.level, wordId: word.id,
      });
    } else if (qType === 2 && word.rootId) {
      // Root meaning
      const root = coreRoots.find(r => r.id === word.rootId);
      if (!root) continue;
      const distractors = coreRoots
        .filter(r => r.id !== root.id).sort(() => Math.random() - 0.5)
        .slice(0, 3).map(r => ({ text: r.meaning, isCorrect: false }));
      questions.push({
        id: i + 1, type: 'root-meaning',
        question: `单词 "${word.word}" 中的词根 "${root.root}" 是什么意思？`,
        options: [...distractors, { text: root.meaning, isCorrect: true }].sort(() => Math.random() - 0.5),
        explanation: `"${root.root}" 意为 "${root.meaning}"，所以 ${word.word} = ${word.meaning}`,
        level: word.level, wordId: word.id,
      });
    } else if (qType === 3) {
      // Fill in example sentence
      const ex = word.example;
      const regex = new RegExp(`\\b${word.word}\\b`, 'i');
      if (regex.test(ex)) {
        const blanked = ex.replace(regex, '______');
        const distractors = allWords
          .filter(w => w.id !== word.id)
          .sort(() => Math.random() - 0.5).slice(0, 3)
          .map(w => ({ text: w.word, isCorrect: false }));
        questions.push({
          id: i + 1, type: 'fill-blank',
          question: blanked,
          options: [...distractors, { text: word.word, isCorrect: true }].sort(() => Math.random() - 0.5),
          explanation: `完整句子：${ex}\n${word.word} = ${word.meaning}`,
          level: word.level, wordId: word.id,
        });
      } else {
        // Fallback to English -> Chinese
        const distractors = allWords
          .filter(w => w.id !== word.id)
          .sort(() => Math.random() - 0.5).slice(0, 3)
          .map(w => ({ text: w.meaning, isCorrect: false }));
        questions.push({
          id: i + 1, type: 'word-meaning',
          question: `"${word.word}" 的意思是？`,
          options: [...distractors, { text: word.meaning, isCorrect: true }].sort(() => Math.random() - 0.5),
          explanation: `${word.word} = ${word.meaning}`,
          level: word.level, wordId: word.id,
        });
      }
    } else {
      // Morpheme match: find same-root sibling
      const rootId = word.rootId;
      if (!rootId) continue;
      const sameRoot = allWords.filter(w => w.rootId === rootId && w.id !== word.id);
      if (sameRoot.length === 0) continue;
      const target = sameRoot[Math.floor(Math.random() * sameRoot.length)];
      const distractors = allWords
        .filter(w => w.rootId !== rootId && w.rootId)
        .sort(() => Math.random() - 0.5).slice(0, 3)
        .map(w => ({ text: w.word, isCorrect: false }));
      questions.push({
        id: i + 1, type: 'morpheme-match',
        question: `哪个单词和 "${word.word}" 有相同的词根？`,
        options: [...distractors, { text: target.word, isCorrect: true }].sort(() => Math.random() - 0.5),
        explanation: `${word.word} 和 ${target.word} 都包含词根 "${rootId}"`,
        level: word.level, wordId: word.id,
      });
    }
  }
  return questions;
};

// ==================== Progress Mutations ====================

export const markWordLearned = (
  progress: UserProgress, wordId: number, quality: number,
): UserProgress => {
  const existing = progress.wordReviews[wordId];
  const review = calculateNextReview(existing, quality);
  review.wordId = wordId;

  const completedWords = progress.completedWords.includes(wordId)
    ? progress.completedWords
    : [...progress.completedWords, wordId];

  const word = allWords.find(w => w.id === wordId);
  const masteredRoots = word?.rootId && !progress.masteredRoots.includes(word.rootId)
    ? [...progress.masteredRoots, word.rootId]
    : progress.masteredRoots;

  // Update mission
  let mission = progress.todayMission;
  if (mission) {
    if (mission.newWordIds.includes(wordId) && !mission.completedNewWords.includes(wordId)) {
      mission = { ...mission, completedNewWords: [...mission.completedNewWords, wordId] };
    }
    if (mission.reviewWordIds.includes(wordId) && !mission.completedReviews.includes(wordId)) {
      mission = { ...mission, completedReviews: [...mission.completedReviews, wordId] };
    }
  }

  return {
    ...progress,
    completedWords,
    masteredRoots,
    wordReviews: { ...progress.wordReviews, [wordId]: review },
    todayMission: mission,
  };
};

export const markRootLearned = (progress: UserProgress, rootId: string): UserProgress => {
  if (progress.learnedRootIds.includes(rootId)) return progress;
  return {
    ...progress,
    learnedRootIds: [...progress.learnedRootIds, rootId],
  };
};

export const markQuizDone = (progress: UserProgress): UserProgress => {
  if (!progress.todayMission) return progress;
  return {
    ...progress,
    todayMission: { ...progress.todayMission, quizDone: true },
  };
};

export const finishDailySession = (
  progress: UserProgress, score: number,
): UserProgress => {
  const today = todayStr();
  const mission = progress.todayMission;
  const wordsLearned = mission?.completedNewWords.length || 0;
  const wordsReviewed = mission?.completedReviews.length || 0;

  const existing = progress.learningHistory.find(h => h.date === today);
  const newHistory = existing
    ? progress.learningHistory.map(h => h.date === today
        ? { ...h, wordsLearned: h.wordsLearned + wordsLearned, wordsReviewed: h.wordsReviewed + wordsReviewed, score: h.score + score }
        : h)
    : [...progress.learningHistory, { date: today, wordsLearned, wordsReviewed, score, timeSpent: 0 }];

  const streak = calculateStreak(newHistory);

  // Level up check
  let newLevel = progress.currentLevel;
  const currentLevelData = levels[progress.currentLevel - 1];
  if (currentLevelData && progress.completedWords.length >= currentLevelData.targetWords && progress.currentLevel < levels.length) {
    newLevel = progress.currentLevel + 1;
  }

  // Advance plan day
  let plan = progress.studyPlan;
  if (plan) {
    plan = { ...plan, currentDay: plan.currentDay + 1 };
  }

  return {
    ...progress,
    currentLevel: newLevel,
    learningHistory: newHistory,
    streak,
    totalScore: progress.totalScore + score,
    studyPlan: plan,
  };
};

// ==================== Stats ====================

export const getLevelProgress = (progress: UserProgress) => {
  const currentLevel = levels[progress.currentLevel - 1] || levels[0];
  const completed = progress.completedWords.length;
  const percentage = Math.min((completed / TOTAL_WORDS) * 100, 100);

  return {
    currentLevel,
    progress: percentage,
    completed,
    total: TOTAL_WORDS,
  };
};

export const getOverallStats = (progress: UserProgress) => {
  const plan = progress.studyPlan;
  const daysRemaining = plan ? Math.max(plan.totalDays - plan.currentDay + 1, 0) : 0;
  const mission = getTodayMission(progress);

  return {
    totalWords: TOTAL_WORDS,
    learnedWords: progress.completedWords.length,
    learnedRoots: progress.learnedRootIds.length,
    totalRoots: coreRoots.length,
    streak: progress.streak,
    wordsPerDay: plan?.wordsPerDay || 0,
    currentDay: plan?.currentDay || 0,
    daysRemaining,
    todayNew: mission.newWordIds.length,
    todayNewDone: mission.completedNewWords.length,
    todayReview: mission.reviewWordIds.length,
    todayReviewDone: mission.completedReviews.length,
  };
};

// ==================== Helpers ====================

const todayStr = (): string => new Date().toISOString().split('T')[0];

const addDays = (dateStr: string, days: number): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const calculateStreak = (history: LearningRecord[]): number => {
  if (history.length === 0) return 0;
  const sorted = [...history].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < sorted.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    if (sorted[i].date === expected.toISOString().split('T')[0]) streak++;
    else break;
  }
  return streak;
};

// Backward compat exports
export const updateProgress = (
  progress: UserProgress, wordsLearned: Word[], score: number, timeSpent: number,
): UserProgress => finishDailySession(
  wordsLearned.reduce((p, w) => markWordLearned(p, w.id, 4), progress), score,
);

export const getTodayWords = (progress: UserProgress): Word[] => {
  const mission = getTodayMission(progress);
  return mission.newWordIds
    .map(id => allWords.find(w => w.id === id))
    .filter(Boolean) as Word[];
};
