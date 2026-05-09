export interface WordMorpheme {
  text: string;
  type: 'prefix' | 'root' | 'suffix';
  meaning: string;
  origin: string;
  color: string;
}

export interface Word {
  id: number;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  meanings: string[];
  morphemes: WordMorpheme[];
  example: string;
  translation: string;
  associationStory: string;
  roots: string[];
  level: number;
  frequency: number;
  rootId?: string;
  category?: string;
}

export interface WordRoot {
  id: string;
  root: string;
  meaning: string;
  origin: string;
  color: string;
  level: number;
  words: SimpleWord[];
}

export interface SimpleWord {
  word: string;
  meaning: string;
}

export interface RootWord {
  word: string;
  meaning: string;
  phonetic: string;
}

export interface Level {
  level: number;
  name: string;
  description: string;
  targetWords: number;
  rootsCount: number;
}

export interface Question {
  id: number;
  type: 'root-meaning' | 'word-meaning' | 'morpheme-match' | 'fill-blank';
  question: string;
  options: {text: string; isCorrect: boolean}[];
  explanation: string;
  level: number;
  wordId?: number;
}

// === Study Plan ===

export interface StudyPlan {
  wordsPerDay: number; // 用户设定的每日目标: 20/30/50
  totalDays: number; // 预计完成天数
  startDate: string; // 开始日期
  currentDay: number; // 当前第几天
}

export interface DailyMission {
  date: string;
  newRoots: string[]; // 今日要学的词根id
  newWordIds: number[]; // 今日要学的新词id
  reviewWordIds: number[]; // 今日要复习的词id
  completedNewWords: number[]; // 已完成的新词
  completedReviews: number[]; // 已完成的复习
  quizDone: boolean;
}

// === Learning Session (引导式学习流程) ===

export type SessionStep =
  | {type: 'root-intro'; rootId: string}
  | {type: 'word-learn'; wordId: number}
  | {type: 'quiz'; questions: Question[]}
  | {type: 'review-card'; wordId: number}
  | {type: 'complete'};

// === User Progress ===

export interface UserProgress {
  currentLevel: number;
  completedWords: number[];
  masteredRoots: string[];
  learningHistory: LearningRecord[];
  streak: number;
  totalScore: number;
  wordReviews: Record<number, WordReviewData>;
  studyPlan: StudyPlan | null;
  todayMission: DailyMission | null;
  learnedRootIds: string[]; // 已教过的词根
}

export interface WordReviewData {
  wordId: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReview: string;
}

export interface LearningRecord {
  date: string;
  wordsLearned: number;
  wordsReviewed: number;
  score: number;
  timeSpent: number;
}

export interface Prefix {
  id: string;
  prefix: string;
  meaning: string;
  origin: string;
  color: string;
  level: number;
  examples: string[];
}

export interface Suffix {
  id: string;
  suffix: string;
  meaning: string;
  origin: string;
  color: string;
  level: number;
  partOfSpeech: string;
  examples: string[];
}
