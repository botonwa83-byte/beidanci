import {describe, it, expect} from '@jest/globals';
import {allWords, getWordOrigin} from '../src/data/wordDatabase';
import wordOrigins from '../src/data/wordOrigins.json';

describe('词源身世（wordOrigins）', () => {
  it('salary 能查到"盐钱"的身世故事', () => {
    const story = getWordOrigin('salary');
    expect(story).toBeTruthy();
    expect(story).toContain('盐');
  });

  it('查询不区分大小写，未收录的词返回 null', () => {
    expect(getWordOrigin('Salary')).toBe(getWordOrigin('salary'));
    expect(getWordOrigin('zzz_not_a_word')).toBeNull();
  });

  it('每条故事都是非空中文文本，且不过长', () => {
    const origins = wordOrigins as Record<string, string>;
    for (const [word, story] of Object.entries(origins)) {
      expect(word).toMatch(/^[a-z]+$/);
      expect(story.length).toBeGreaterThan(4);
      expect(story.length).toBeLessThan(120);
      expect(/[一-鿿]/.test(story)).toBe(true);
    }
  });

  it('大部分收录词存在于词库（身世卡有处可挂）', () => {
    const origins = wordOrigins as Record<string, string>;
    const dbWords = new Set(allWords.map(w => w.word.toLowerCase()));
    const inDb = Object.keys(origins).filter(k => dbWords.has(k.toLowerCase()));
    expect(inDb.length).toBeGreaterThan(180);
  });
});
