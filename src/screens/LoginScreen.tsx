import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme} from '../theme';
import {
  isValidPhone,
  sendVerificationCode,
  verifyCode,
  AuthUser,
} from '../data/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  const insets = useSafeAreaInsets();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const codeInputRef = useRef<TextInput>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startCountdown = () => {
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    if (!isValidPhone(phone)) {
      Alert.alert('提示', '请输入正确的11位手机号');
      return;
    }
    setLoading(true);
    const result = await sendVerificationCode(phone);
    setLoading(false);

    if (result.success) {
      setStep('code');
      startCountdown();
      setTimeout(() => codeInputRef.current?.focus(), 300);
      if (__DEV__) {
        Alert.alert('开发模式', '验证码已打印到控制台，或输入 000000 直接登录');
      }
    } else {
      Alert.alert('发送失败', result.message);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) {
      return;
    }
    setLoading(true);
    const result = await sendVerificationCode(phone);
    setLoading(false);
    if (result.success) {
      startCountdown();
      if (__DEV__) {
        Alert.alert('开发模式', '新验证码已打印到控制台，或输入 000000');
      }
    } else {
      Alert.alert('发送失败', result.message);
    }
  };

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('提示', '请输入6位验证码');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    const result = await verifyCode(phone, code);
    setLoading(false);

    if (result.success && result.user) {
      onLoginSuccess(result.user);
    } else {
      Alert.alert('验证失败', result.message);
    }
  };

  const handleBack = () => {
    setStep('phone');
    setCode('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.content, {paddingTop: insets.top + 60}]}>
        {/* Logo area */}
        <View style={styles.logoWrap}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>{'\u8BCD'}</Text>
          </View>
          <Text style={styles.appName}>{'\u80CC\u5355\u8BCD'}</Text>
          <Text style={styles.appSlogan}>
            {'\u8BCD\u6839\u8BCD\u7F00'} {'\u00B7'} {'\u9AD8\u6548\u8BB0\u5FC6'}
          </Text>
        </View>

        {step === 'phone' ? (
          /* Step 1: Phone input */
          <View style={styles.formWrap}>
            <Text style={styles.formTitle}>手机号登录/注册</Text>
            <Text style={styles.formSub}>首次登录将自动注册账号</Text>

            <View style={styles.inputWrap}>
              <Text style={styles.inputPrefix}>+86</Text>
              <TextInput
                style={styles.phoneInput}
                placeholder="请输入手机号"
                placeholderTextColor={theme.colors.textTertiary}
                value={phone}
                onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, 11))}
                keyboardType="number-pad"
                maxLength={11}
                autoFocus
              />
              {phone.length > 0 && (
                <TouchableOpacity
                  onPress={() => setPhone('')}
                  style={styles.clearBtn}>
                  <Text style={styles.clearText}>{'\u2715'}</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                !isValidPhone(phone) && styles.btnDisabled,
              ]}
              onPress={handleSendCode}
              disabled={!isValidPhone(phone) || loading}
              activeOpacity={0.7}>
              <Text style={styles.primaryBtnText}>
                {loading ? '发送中...' : '获取验证码'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.agreement}>
              登录即表示同意《用户协议》和《隐私政策》
            </Text>
          </View>
        ) : (
          /* Step 2: Code verification */
          <View style={styles.formWrap}>
            <TouchableOpacity onPress={handleBack} style={styles.backRow}>
              <Text style={styles.backArrow}>{'\u2039'}</Text>
              <Text style={styles.backLabel}>返回</Text>
            </TouchableOpacity>

            <Text style={styles.formTitle}>输入验证码</Text>
            <Text style={styles.formSub}>
              验证码已发送至 {phone.slice(0, 3)}****{phone.slice(7)}
            </Text>

            {/* Code input boxes */}
            <View style={styles.codeRow}>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <View
                  key={i}
                  style={[
                    styles.codeBox,
                    code.length === i && styles.codeBoxActive,
                  ]}>
                  <Text style={styles.codeChar}>{code[i] || ''}</Text>
                </View>
              ))}
            </View>
            <TextInput
              ref={codeInputRef}
              style={styles.hiddenInput}
              value={code}
              onChangeText={t => setCode(t.replace(/\D/g, '').slice(0, 6))}
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                code.length !== 6 && styles.btnDisabled,
              ]}
              onPress={handleVerify}
              disabled={code.length !== 6 || loading}
              activeOpacity={0.7}>
              <Text style={styles.primaryBtnText}>
                {loading ? '验证中...' : '登录'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleResend}
              disabled={countdown > 0}
              style={styles.resendBtn}>
              <Text
                style={[
                  styles.resendText,
                  countdown > 0 && styles.resendDisabled,
                ]}>
                {countdown > 0 ? `${countdown}s 后重新发送` : '重新发送验证码'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
  },

  // Logo
  logoWrap: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  appSlogan: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },

  // Form
  formWrap: {
    gap: 16,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  formSub: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },

  // Phone input
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E8ECF2',
    paddingHorizontal: 16,
    height: 56,
  },
  inputPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: '#E8ECF2',
  },
  phoneInput: {
    flex: 1,
    fontSize: 18,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    height: 56,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },

  // Primary button
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: {
    backgroundColor: theme.colors.textTertiary + '60',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  agreement: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },

  // Back button
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  backArrow: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    fontWeight: '300',
  },
  backLabel: {
    fontSize: 15,
    color: theme.colors.textSecondary,
  },

  // Code input
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  codeBox: {
    flex: 1,
    height: 56,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E8ECF2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeBoxActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  codeChar: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
    width: 0,
  },

  // Resend
  resendBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  resendDisabled: {
    color: theme.colors.textTertiary,
  },
});
