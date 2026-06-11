import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 猜词「每日免费次数」额度。
 * 非会员每天可免费破译 DAILY_FREE_GUESSES 次，次日 0 点（按本地日期）重置；
 * 会员不受限（在调用方用 isPremium 跳过本模块）。
 */
const STORAGE_KEY = '@wordpulse/guess_quota_v1';

export const DAILY_FREE_GUESSES = 5;

interface QuotaState {
  date: string; // 本地日期 YYYY-M-D
  count: number; // 今日已用次数
}

const todayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/** 读取今日已用次数（跨天自动归零）。 */
export const loadGuessUsedToday = async (): Promise<number> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return 0;
    }
    const s: QuotaState = JSON.parse(raw);
    return s.date === todayStr() ? Number(s.count) || 0 : 0;
  } catch {
    return 0;
  }
};

/** 今日剩余免费次数。 */
export const loadGuessRemaining = async (): Promise<number> => {
  const used = await loadGuessUsedToday();
  return Math.max(0, DAILY_FREE_GUESSES - used);
};

/**
 * 消耗一次免费额度，返回消耗后的剩余次数。
 * 调用前应确认非会员且 remaining > 0。
 */
export const consumeGuess = async (): Promise<number> => {
  const used = await loadGuessUsedToday();
  const next = used + 1;
  try {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({date: todayStr(), count: next} as QuotaState),
    );
  } catch {
    // 额度写入失败：宽松处理，不阻断用户
  }
  return Math.max(0, DAILY_FREE_GUESSES - next);
};
