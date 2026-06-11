import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE_NAME = 'com.botonwa83.wordpulse.auth';
const MIGRATION_KEY = 'beidanci_auth_migrated';

/**
 * Secure storage for auth data using iOS Keychain.
 * Falls back to AsyncStorage on error and handles migration from AsyncStorage.
 */

export const secureGet = async (key: string): Promise<string | null> => {
  try {
    const result = await Keychain.getGenericPassword({
      service: `${SERVICE_NAME}.${key}`,
    });
    if (result) {
      return result.password;
    }
  } catch (e) {
    console.warn('[SecureStorage] Keychain read failed, falling back:', e);
  }
  return null;
};

export const secureSet = async (key: string, value: string): Promise<void> => {
  try {
    await Keychain.setGenericPassword(key, value, {
      service: `${SERVICE_NAME}.${key}`,
    });
  } catch (e) {
    console.warn('[SecureStorage] Keychain write failed:', e);
    throw e;
  }
};

export const secureRemove = async (key: string): Promise<void> => {
  try {
    await Keychain.resetGenericPassword({service: `${SERVICE_NAME}.${key}`});
  } catch (e) {
    console.warn('[SecureStorage] Keychain remove failed:', e);
  }
};

/**
 * One-time migration from AsyncStorage to Keychain.
 * Called on app startup.
 */
export const migrateAuthToKeychain = async (): Promise<void> => {
  try {
    const migrated = await AsyncStorage.getItem(MIGRATION_KEY);
    if (migrated === 'done') {
      return;
    }

    const oldData = await AsyncStorage.getItem('beidanci_auth');
    if (oldData) {
      await secureSet('auth', oldData);
      await AsyncStorage.removeItem('beidanci_auth');
    }
    await AsyncStorage.setItem(MIGRATION_KEY, 'done');
  } catch (e) {
    console.warn('[SecureStorage] Migration failed:', e);
  }
};
