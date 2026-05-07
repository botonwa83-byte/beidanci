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
  morphemes: WordMorpheme[];
  example: string;
  translation: string;
  associationStory: string;
  roots: string[];
  level: number;
  frequency: number;
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
  prefixesCount: number;
  suffixesCount: number;
}

export interface Question {
  id: number;
  question: string;
  options: { text: string; isCorrect: boolean }[];
  explanation: string;
  level: number;
}

export interface UserProgress {
  currentLevel: number;
  completedWords: number[];
  masteredRoots: string[];
  learningHistory: LearningRecord[];
  streak: number;
  totalScore: number;
}

export interface LearningRecord {
  date: string;
  wordsLearned: number;
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
