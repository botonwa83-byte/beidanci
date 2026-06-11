import AsyncStorage from '@react-native-async-storage/async-storage';
import {guessWords, GuessWord} from './guessWords';

/**
 * 猜词模块的"超能力值/段位"持久化。
 * 与学习进度分开存储，互不影响。
 */
const STORAGE_KEY = '@wordpulse/guess_progress_v1';

export interface GuessProgress {
  totalDecoded: number; // 累计破译（练习）过的词数
  maxCombo: number; // 历史最高连击
}

const DEFAULT: GuessProgress = {totalDecoded: 0, maxCombo: 0};

export const loadGuessProgress = async (): Promise<GuessProgress> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {...DEFAULT};
    }
    const parsed = JSON.parse(raw);
    return {
      totalDecoded: Number(parsed.totalDecoded) || 0,
      maxCombo: Number(parsed.maxCombo) || 0,
    };
  } catch {
    return {...DEFAULT};
  }
};

export const saveGuessProgress = async (p: GuessProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // 破译进度非关键数据，写入失败静默忽略
  }
};

// === 段位 ===
export interface RankTier {
  title: string;
  min: number;
}

export const RANKS: RankTier[] = [
  {title: '词根学徒', min: 0},
  {title: '词根行者', min: 10},
  {title: '词根游侠', min: 25},
  {title: '词根猎人', min: 50},
  {title: '词根大师', min: 90},
  {title: '词根宗师', min: 140},
];

export interface RankInfo {
  title: string;
  floor: number; // 当前段位起点
  ceil: number | null; // 下一段位门槛（null = 已满级）
  nextTitle: string | null;
}

export const getRank = (total: number): RankInfo => {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (total >= RANKS[i].min) {
      idx = i;
    }
  }
  const cur = RANKS[idx];
  const next = RANKS[idx + 1] || null;
  return {
    title: cur.title,
    floor: cur.min,
    ceil: next ? next.min : null,
    nextTitle: next ? next.title : null,
  };
};

/** 今日神词：按日期确定，全体用户当天一致，养成每日打开习惯 */
export const getDailyWord = (): GuessWord => {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return guessWords[dayIndex % guessWords.length];
};

/** 连击对应的鼓励语 */
export const comboCheer = (combo: number): string => {
  if (combo >= 8) {
    return '势不可挡！';
  }
  if (combo >= 5) {
    return '手感爆棚 🔥';
  }
  if (combo >= 3) {
    return '连对，状态来了！';
  }
  if (combo >= 2) {
    return '漂亮，继续！';
  }
  return '';
};
