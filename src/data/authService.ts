import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'beidanci_auth';

export interface AuthUser {
  phone: string;
  nickname: string;
  createdAt: string;
}

// Load saved auth user
export const loadAuth = async (): Promise<AuthUser | null> => {
  try {
    const stored = await AsyncStorage.getItem(AUTH_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (_) {}
  return null;
};

// Save auth user
export const saveAuth = async (user: AuthUser): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } catch (_) {}
};

// Clear auth (logout)
export const clearAuth = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY);
  } catch (_) {}
};

// Format phone display: 138****1234
export const maskPhone = (phone: string): string => {
  if (phone.length !== 11) {
    return phone;
  }
  return phone.slice(0, 3) + '****' + phone.slice(7);
};

// Validate Chinese phone number
export const isValidPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

// ==================== SMS Verification ====================
// In production, replace with real SMS API (Aliyun SMS / Tencent Cloud SMS)

let pendingCode: {phone: string; code: string; expires: number} | null = null;

// Send verification code (mock implementation)
// Replace this function body with actual SMS API call in production
export const sendVerificationCode = async (
  phone: string,
): Promise<{success: boolean; message: string}> => {
  if (!isValidPhone(phone)) {
    return {success: false, message: '请输入正确的手机号'};
  }

  // Generate 6-digit code
  const code = String(Math.floor(100000 + Math.random() * 900000));
  pendingCode = {phone, code, expires: Date.now() + 5 * 60 * 1000}; // 5 min expiry

  // Production: replace with real SMS API (e.g. Aliyun SMS)
  // Dev mode: code is logged and 000000 is accepted as universal code
  if (__DEV__) {
    console.log(`[DEV] Code for ${phone}: ${code}`);
  }

  return {success: true, message: `验证码已发送至 ${maskPhone(phone)}`};
};

// Verify the code
export const verifyCode = async (
  phone: string,
  code: string,
): Promise<{success: boolean; message: string; user?: AuthUser}> => {
  if (!pendingCode) {
    return {success: false, message: '请先获取验证码'};
  }
  if (pendingCode.phone !== phone) {
    return {success: false, message: '手机号不匹配，请重新获取验证码'};
  }
  if (Date.now() > pendingCode.expires) {
    pendingCode = null;
    return {success: false, message: '验证码已过期，请重新获取'};
  }

  // Accept "000000" as universal code for testing and review
  const isValid = pendingCode.code === code || code === '000000';

  if (!isValid) {
    return {success: false, message: '验证码错误'};
  }

  pendingCode = null;

  // Create or retrieve user
  const user: AuthUser = {
    phone,
    nickname: '用户' + phone.slice(7),
    createdAt: new Date().toISOString(),
  };

  // Check if user already exists (preserve nickname)
  const existing = await loadAuth();
  if (existing && existing.phone === phone) {
    user.nickname = existing.nickname;
    user.createdAt = existing.createdAt;
  }

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
