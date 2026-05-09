import {NativeModules} from 'react-native';

const {Speech} = NativeModules;

export const speak = (word: string) => {
  if (!Speech?.speak) {
    return;
  }
  Speech.speak(word, 'en-US', 0.45);
};
