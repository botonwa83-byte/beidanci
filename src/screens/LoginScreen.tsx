import React, {useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  Keyboard,
  Modal,
  FlatList,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {theme, useAppTheme, ThemeColors} from '../theme';
import {
  isValidPhone,
  loginWithPhone,
  getPhoneMaxLength,
  countryCodes,
  AuthUser,
} from '../data/authService';
import {PrivacyScreen} from './PrivacyScreen';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({onLoginSuccess}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+86');
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyType, setPrivacyType] = useState<'privacy' | 'terms' | null>(null);

  const maxLen = getPhoneMaxLength(countryCode);
  const phoneValid = isValidPhone(phone, countryCode);
  const currentCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];

  const handleLogin = async () => {
    if (!phoneValid) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      const result = await loginWithPhone(phone, countryCode);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        Alert.alert('登录失败', result.message);
      }
    } catch {
      Alert.alert('登录失败', '数据存储异常，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, {paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40}]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Logo area */}
        <View style={styles.logoWrap}>
          <View style={styles.logoOuter}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>{'\u8BCD'}</Text>
            </View>
          </View>
          <Text style={styles.appName}>WordPulse</Text>
          <Text style={styles.appSlogan}>
            {'\u8BCD\u6839\u8BCD\u7F00'} {'\u00B7'} {'\u9AD8\u6548\u8BB0\u5FC6'}
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>开始学习</Text>
          <Text style={styles.formSub}>输入手机号作为你的学习 ID</Text>

          <View style={[styles.inputWrap, phone.length > 0 && styles.inputWrapFocused]}>
            <TouchableOpacity
              style={styles.countryBtn}
              onPress={() => setShowCountryPicker(true)}
              accessibilityLabel={`当前国家代码 ${countryCode}，点击切换`}
              accessibilityRole="button">
              <Text style={styles.countryFlag}>{currentCountry.flag}</Text>
              <Text style={styles.inputPrefix}>{countryCode}</Text>
              <Text style={styles.dropdownArrow}>{'\u25BE'}</Text>
            </TouchableOpacity>
            <View style={styles.inputDivider} />
            <TextInput
              style={styles.phoneInput}
              placeholder="请输入手机号"
              placeholderTextColor={colors.textTertiary}
              value={phone}
              onChangeText={t => setPhone(t.replace(/\D/g, '').slice(0, maxLen))}
              keyboardType="number-pad"
              maxLength={maxLen}
              accessibilityLabel="手机号输入框"
              accessibilityHint="请输入手机号码"
            />
            {phone.length > 0 && (
              <TouchableOpacity
                onPress={() => setPhone('')}
                style={styles.clearBtn}
                accessibilityLabel="清除手机号"
                accessibilityRole="button">
                <Text style={styles.clearText}>{'\u2715'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.primaryBtn,
              !phoneValid && styles.btnDisabled,
            ]}
            onPress={handleLogin}
            disabled={!phoneValid || loading}
            activeOpacity={0.8}
            accessibilityLabel={loading ? '登录中' : '进入学习'}
            accessibilityRole="button"
            accessibilityState={{disabled: !phoneValid || loading}}>
            <Text style={styles.primaryBtnText}>
              {loading ? '登录中...' : '进入学习'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.agreement}>
          手机号仅存储在本地设备，用于标识学习进度{'\n'}
          <Text
            style={styles.link}
            onPress={() => setPrivacyType('terms')}>
            《用户协议》
          </Text>
          和
          <Text
            style={styles.link}
            onPress={() => setPrivacyType('privacy')}>
            《隐私政策》
          </Text>
        </Text>
      </ScrollView>

      {/* Country code picker */}
      <Modal visible={showCountryPicker} animationType="slide" transparent>
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerContainer, {paddingBottom: insets.bottom + 20}]}>
            <View style={styles.pickerHandle} />
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>选择国家/地区</Text>
              <TouchableOpacity
                onPress={() => setShowCountryPicker(false)}
                style={styles.pickerDoneBtn}
                accessibilityLabel="关闭"
                accessibilityRole="button">
                <Text style={styles.pickerClose}>完成</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={countryCodes}
              keyExtractor={item => item.code}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    item.code === countryCode && styles.countryItemActive,
                  ]}
                  onPress={() => {
                    setCountryCode(item.code);
                    setPhone('');
                    setShowCountryPicker(false);
                  }}
                  accessibilityLabel={`${item.label} ${item.code}`}
                  accessibilityRole="button"
                  accessibilityState={{selected: item.code === countryCode}}>
                  <Text style={styles.countryItemFlag}>{item.flag}</Text>
                  <Text style={styles.countryItemLabel}>{item.label}</Text>
                  <Text style={[
                    styles.countryItemCode,
                    item.code === countryCode && {color: colors.primary},
                  ]}>{item.code}</Text>
                  {item.code === countryCode && (
                    <Text style={styles.checkMark}>{'\u2713'}</Text>
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={privacyType !== null} animationType="slide">
        {privacyType && (
          <PrivacyScreen
            type={privacyType}
            onClose={() => setPrivacyType(null)}
          />
        )}
      </Modal>
    </KeyboardAvoidingView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 28,
      maxWidth: 440,
      width: '100%',
      alignSelf: 'center',
    },

    // Logo
    logoWrap: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logoOuter: {
      width: 96,
      height: 96,
      borderRadius: 28,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    logoCircle: {
      width: 72,
      height: 72,
      borderRadius: 22,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      ...theme.shadow.colored(colors.primary),
    },
    logoText: {
      fontSize: 34,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    appName: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    appSlogan: {
      fontSize: 14,
      color: colors.textTertiary,
      letterSpacing: 2,
    },

    // Form card
    formCard: {
      backgroundColor: colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
      gap: 16,
      ...theme.shadow.md,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    formSub: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
      lineHeight: 20,
    },

    // Phone input
    inputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceLight,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: colors.divider,
      paddingHorizontal: 12,
      height: 54,
    },
    inputWrapFocused: {
      borderColor: colors.primary + '50',
      backgroundColor: colors.primaryLight + '40',
    },
    countryBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 8,
      gap: 5,
    },
    countryFlag: {
      fontSize: 18,
    },
    inputPrefix: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textPrimary,
    },
    dropdownArrow: {
      fontSize: 10,
      color: colors.textTertiary,
      marginLeft: 2,
    },
    inputDivider: {
      width: 1,
      height: 22,
      backgroundColor: colors.divider,
      marginHorizontal: 10,
    },
    phoneInput: {
      flex: 1,
      fontSize: 17,
      color: colors.textPrimary,
      letterSpacing: 1.5,
      height: 54,
    },
    clearBtn: {
      padding: 6,
    },
    clearText: {
      fontSize: 13,
      color: colors.textTertiary,
    },

    // Primary button
    primaryBtn: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
      ...theme.shadow.colored(colors.primary),
    },
    btnDisabled: {
      backgroundColor: colors.textTertiary + '50',
      shadowOpacity: 0,
      elevation: 0,
    },
    primaryBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },

    agreement: {
      fontSize: 12,
      color: colors.textTertiary,
      textAlign: 'center',
      marginTop: 24,
      lineHeight: 20,
    },
    link: {
      color: colors.primary,
    },

    // Country picker modal
    pickerOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.35)',
      justifyContent: 'flex-end',
    },
    pickerContainer: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '55%',
    },
    pickerHandle: {
      width: 36,
      height: 4,
      backgroundColor: colors.divider,
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 4,
    },
    pickerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
    },
    pickerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    pickerDoneBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: colors.primaryLight,
      borderRadius: 8,
    },
    pickerClose: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.divider,
      marginLeft: 60,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      gap: 12,
    },
    countryItemActive: {
      backgroundColor: colors.primaryLight,
    },
    countryItemFlag: {
      fontSize: 24,
    },
    countryItemLabel: {
      flex: 1,
      fontSize: 16,
      color: colors.textPrimary,
    },
    countryItemCode: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    checkMark: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: 'bold',
      marginLeft: 4,
    },
  });
