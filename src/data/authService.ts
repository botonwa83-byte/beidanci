import {secureGet, secureSet, secureRemove} from './secureStorage';

const AUTH_KEY = 'auth';

export interface AuthUser {
  phone: string;
  nickname: string;
  createdAt: string;
}

// Load saved auth user (from Keychain)
export const loadAuth = async (): Promise<AuthUser | null> => {
  try {
    const stored = await secureGet(AUTH_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('[Auth] 读取用户数据失败:', e);
  }
  return null;
};

// Save auth user (to Keychain)
export const saveAuth = async (user: AuthUser): Promise<void> => {
  try {
    await secureSet(AUTH_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('[Auth] 保存用户数据失败:', e);
    throw e;
  }
};

// Clear auth (logout)
export const clearAuth = async (): Promise<void> => {
  try {
    await secureRemove(AUTH_KEY);
  } catch (e) {
    console.warn('[Auth] 清除用户数据失败:', e);
  }
};

// Format phone display: 138****1234
export const maskPhone = (phone: string): string => {
  if (phone.length < 7) {
    return phone;
  }
  return phone.slice(0, 3) + '****' + phone.slice(-4);
};

// Validate phone number (supports international formats)
export const isValidPhone = (
  phone: string,
  countryCode: string = '+86',
): boolean => {
  const rules: Record<string, RegExp> = {
    '+86': /^1[3-9]\d{9}$/, // China: 11 digits starting with 1
    '+1': /^[2-9]\d{9}$/, // US/Canada: 10 digits
    '+44': /^7\d{9}$/, // UK: 10 digits starting with 7
    '+81': /^[0-9]\d{9,10}$/, // Japan: 10-11 digits
    '+82': /^1\d{9,10}$/, // Korea: 10-11 digits
    '+852': /^[5-9]\d{7}$/, // Hong Kong: 8 digits
    '+853': /^6\d{7}$/, // Macau: 8 digits
    '+886': /^9\d{8}$/, // Taiwan: 9 digits
    '+65': /^[89]\d{7}$/, // Singapore: 8 digits
    '+60': /^1\d{8,9}$/, // Malaysia: 9-10 digits
  };
  const regex = rules[countryCode];
  if (regex) {
    return regex.test(phone);
  }
  // Fallback: accept 6-15 digits for unlisted countries
  return /^\d{6,15}$/.test(phone);
};

// Get max phone length for country code
export const getPhoneMaxLength = (countryCode: string): number => {
  const lengths: Record<string, number> = {
    '+86': 11,
    '+1': 10,
    '+44': 10,
    '+81': 11,
    '+82': 11,
    '+852': 8,
    '+853': 8,
    '+886': 9,
    '+65': 8,
    '+60': 10,
  };
  return lengths[countryCode] || 15;
};

// Country code list
export const countryCodes = [
  {code: '+86', label: '中国大陆', flag: '\uD83C\uDDE8\uD83C\uDDF3'},
  {code: '+852', label: '中国香港', flag: '\uD83C\uDDED\uD83C\uDDF0'},
  {code: '+853', label: '中国澳门', flag: '\uD83C\uDDF2\uD83C\uDDF4'},
  {code: '+886', label: '中国台湾', flag: '\uD83C\uDDF9\uD83C\uDDFC'},
  {code: '+1', label: '美国/加拿大', flag: '\uD83C\uDDFA\uD83C\uDDF8'},
  {code: '+44', label: '英国', flag: '\uD83C\uDDEC\uD83C\uDDE7'},
  {code: '+81', label: '日本', flag: '\uD83C\uDDEF\uD83C\uDDF5'},
  {code: '+82', label: '韩国', flag: '\uD83C\uDDF0\uD83C\uDDF7'},
  {code: '+65', label: '新加坡', flag: '\uD83C\uDDF8\uD83C\uDDEC'},
  {code: '+60', label: '马来西亚', flag: '\uD83C\uDDF2\uD83C\uDDFE'},
];

// Login with phone number as local ID (no SMS verification)
export const loginWithPhone = async (
  phone: string,
  countryCode: string = '+86',
): Promise<{success: boolean; message: string; user?: AuthUser}> => {
  if (!isValidPhone(phone, countryCode)) {
    return {success: false, message: '请输入正确的手机号'};
  }

  const fullPhone = `${countryCode}${phone}`;

  // Check if user already exists (preserve nickname and createdAt)
  const existing = await loadAuth();
  if (existing && existing.phone === fullPhone) {
    return {success: true, message: '登录成功', user: existing};
  }

  // New user
  const user: AuthUser = {
    phone: fullPhone,
    nickname: '用户' + phone.slice(-4),
    createdAt: new Date().toISOString(),
  };

  await saveAuth(user);
  return {success: true, message: '登录成功', user};
};

// Update nickname
export const updateNickname = async (
  nickname: string,
): Promise<AuthUser | null> => {
  const user = await loadAuth();
  if (!user) {
    return null;
  }
  const updated = {...user, nickname: nickname.trim() || user.nickname};
  await saveAuth(updated);
  return updated;
};
