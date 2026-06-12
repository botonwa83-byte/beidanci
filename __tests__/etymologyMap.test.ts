import {describe, test, expect} from '@jest/globals';
import {
  LANG_META,
  getWordLanguage,
  taggedWordCount,
  totalWordCount,
  computeEtymologyMap,
  buildMapShareMessage,
} from '../src/data/etymologyMap';
import wordLanguagesData from '../src/data/wordLanguages.json';
import {allWords} from '../src/data/wordDatabase';

describe('词源版图', () => {
  test('LANG_META id 唯一', () => {
    const ids = LANG_META.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('人工标签的语言必须在 LANG_META 中', () => {
    const valid = new Set(LANG_META.map(m => m.id));
    const bad = Object.entries(wordLanguagesData as Record<string, string>)
      .filter(([, lang]) => !valid.has(lang))
      .map(([w, lang]) => `${w}:${lang}`);
    expect(bad).toEqual([]);
  });

  test('全库可定源覆盖率不低于 70%', () => {
    expect(totalWordCount).toBe(allWords.length);
    expect(taggedWordCount / totalWordCount).toBeGreaterThanOrEqual(0.7);
  });

  test('getWordLanguage 返回 canonical 语言名', () => {
    const valid = new Set(LANG_META.map(m => m.id));
    for (const w of allWords) {
      const lang = getWordLanguage(w);
      if (lang !== null) {
        expect(valid.has(lang)).toBe(true);
      }
    }
  });

  test('空进度：无点亮、无 topShare', () => {
    const stats = computeEtymologyMap([]);
    expect(stats.learnedTotal).toBe(0);
    expect(stats.learnedTagged).toBe(0);
    expect(stats.topShare).toBeNull();
    expect(stats.territories.every(t => t.learned === 0)).toBe(true);
  });

  test('学过的可定源词会点亮对应领土', () => {
    const tagged = allWords.filter(w => getWordLanguage(w)).slice(0, 50);
    const stats = computeEtymologyMap(tagged.map(w => w.id));
    expect(stats.learnedTagged).toBe(tagged.length);
    expect(stats.topShare).not.toBeNull();
    const litSum = stats.territories.reduce((s, t) => s + t.learned, 0);
    expect(litSum).toBe(tagged.length);
    // 已点亮领土排在前面
    const firstDimIdx = stats.territories.findIndex(t => t.learned === 0);
    if (firstDimIdx >= 0) {
      expect(
        stats.territories.slice(firstDimIdx).every(t => t.learned === 0),
      ).toBe(true);
    }
  });

  test('领土样例词数不超过 3 且都是已学词', () => {
    const tagged = allWords.filter(w => getWordLanguage(w)).slice(0, 200);
    const learnedSet = new Set(tagged.map(w => w.word));
    const stats = computeEtymologyMap(tagged.map(w => w.id));
    for (const t of stats.territories) {
      expect(t.samples.length).toBeLessThanOrEqual(3);
      for (const s of t.samples) {
        expect(learnedSet.has(s)).toBe(true);
      }
    }
  });

  test('分享文案含 slogan 与点亮数', () => {
    const tagged = allWords.filter(w => getWordLanguage(w)).slice(0, 30);
    const stats = computeEtymologyMap(tagged.map(w => w.id));
    const msg = buildMapShareMessage(stats);
    expect(msg).toContain('没有一个单词是凭空来的');
    expect(msg).toContain(`${stats.learnedTagged}`);
    expect(msg).toContain('WordPulse');
  });
});
