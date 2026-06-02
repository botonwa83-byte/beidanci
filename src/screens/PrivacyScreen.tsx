import React, {useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppTheme, ThemeColors} from '../theme';

interface PrivacyScreenProps {
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const PrivacyScreen: React.FC<PrivacyScreenProps> = ({type, onClose}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isPrivacy = type === 'privacy';

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} activeOpacity={0.7} accessibilityLabel="关闭" accessibilityRole="button">
          <Text style={styles.closeBtn}>关闭</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isPrivacy ? '隐私政策' : '用户协议'}
        </Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: insets.bottom + 40}}>
        {isPrivacy ? <PrivacyContent styles={styles} /> : <TermsContent styles={styles} />}
      </ScrollView>
    </View>
  );
};

const PrivacyContent: React.FC<{styles: ReturnType<typeof createStyles>}> = ({styles}) => (
  <View style={styles.content}>
    <Text style={styles.updateDate}>更新日期：2025年5月</Text>

    <Text style={styles.sectionTitle}>一、我们收集的信息</Text>
    <Text style={styles.body}>
      WordPulse（以下简称"本应用"）仅收集您主动输入的手机号码，用于在本地标识您的学习进度。
      我们不会将您的手机号上传到任何服务器。
    </Text>

    <Text style={styles.sectionTitle}>二、信息存储</Text>
    <Text style={styles.body}>
      您的手机号和学习进度数据仅存储在您的设备本地，不会通过网络传输或存储到云端。
      卸载应用后，所有本地数据将被清除。
    </Text>

    <Text style={styles.sectionTitle}>三、信息共享</Text>
    <Text style={styles.body}>
      本应用不会与任何第三方共享您的个人信息。我们不使用任何第三方分析、广告或追踪服务。
    </Text>

    <Text style={styles.sectionTitle}>四、数据安全</Text>
    <Text style={styles.body}>
      我们采用设备本地存储的方式保护您的数据安全。由于数据不离开您的设备，因此不存在网络传输中的安全风险。
    </Text>

    <Text style={styles.sectionTitle}>五、您的权利</Text>
    <Text style={styles.body}>
      您可以随时在应用内退出登录或重置学习进度，以清除本地存储的个人数据。
    </Text>

    <Text style={styles.sectionTitle}>六、政策更新</Text>
    <Text style={styles.body}>
      本隐私政策可能会不时更新。更新后的政策将在应用内公布，建议您定期查阅。
    </Text>
  </View>
);

const TermsContent: React.FC<{styles: ReturnType<typeof createStyles>}> = ({styles}) => (
  <View style={styles.content}>
    <Text style={styles.updateDate}>更新日期：2025年5月</Text>

    <Text style={styles.sectionTitle}>一、服务说明</Text>
    <Text style={styles.body}>
      WordPulse 是一款英语单词学习工具，通过词根词缀记忆法帮助用户高效记忆英语单词。
      本应用提供的所有学习内容仅供参考。
    </Text>

    <Text style={styles.sectionTitle}>二、用户行为</Text>
    <Text style={styles.body}>
      用户应合法使用本应用，不得利用本应用从事任何违法活动。
      用户对其输入的个人信息（如手机号）的真实性负责。
    </Text>

    <Text style={styles.sectionTitle}>三、知识产权</Text>
    <Text style={styles.body}>
      本应用的所有内容（包括但不限于文字、图标、界面设计、程序代码）的知识产权归开发者所有。
      未经授权，不得复制、修改或分发。
    </Text>

    <Text style={styles.sectionTitle}>四、免责声明</Text>
    <Text style={styles.body}>
      本应用按"原样"提供，不对学习效果做出任何保证。
      因使用本应用所产生的任何直接或间接损失，开发者不承担责任。
    </Text>

    <Text style={styles.sectionTitle}>五、协议修改</Text>
    <Text style={styles.body}>
      开发者保留随时修改本协议的权利。修改后的协议将在应用内公布，
      继续使用本应用即表示您同意修改后的协议。
    </Text>
  </View>
);

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.surface,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.divider,
      backgroundColor: colors.surface,
    },
    closeBtn: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: '600',
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    placeholder: {width: 40},
    scroll: {flex: 1, backgroundColor: colors.background},
    content: {
      paddingHorizontal: 24,
      paddingTop: 24,
      maxWidth: 600,
      alignSelf: 'center',
      width: '100%',
    },
    updateDate: {
      fontSize: 12,
      color: colors.textTertiary,
      marginBottom: 24,
      fontWeight: '500',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.textPrimary,
      marginTop: 24,
      marginBottom: 10,
    },
    body: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 24,
    },
  });
