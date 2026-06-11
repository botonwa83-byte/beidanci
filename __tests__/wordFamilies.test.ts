import {describe, it, expect} from '@jest/globals';
import {
  getFamilyWords,
  getUnlearnedFamilyWords,
  familyCoverage,
} from '../src/data/wordFamilies';
import {markWordHarvested, getInitialProgress} from '../src/data/learningLogic';
import {allWords} from '../src/data/wordDatabase';

describe('派生词家族（带学）', () => {
  it('家族索引覆盖相当数量的词，且家族成员互相可见', () => {
    const {wordsInFamilies, families} = familyCoverage();
    expect(families).toBeGreaterThan(50);
    expect(wordsInFamilies).toBeGreaterThan(families * 2 - families); // 每家族 ≥2 词
    // 抽查：import 应该和 importer/importation 等同家族
    const imp = allWords.find(w => w.word === 'import');
    if (imp) {
      const family = getFamilyWords(imp.id).map(w => w.word);
      expect(family.length).toBeGreaterThan(0);
      expect(family.some(w => w.startsWith('import') && w !== 'import')).toBe(
        true,
      );
    }
  });

  it('家族关系对称：A 在 B 的家族里，则 B 也在 A 的家族里', () => {
    let checked = 0;
    for (const w of allWords) {
      const fam = getFamilyWords(w.id);
      if (fam.length === 0) {
        continue;
      }
      for (const other of fam) {
        expect(getFamilyWords(other.id).map(x => x.id)).toContain(w.id);
      }
      if (++checked >= 20) {
        break;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('getUnlearnedFamilyWords 排除已学词并按词长升序', () => {
    const anchor = allWords.find(w => getFamilyWords(w.id).length >= 2);
    expect(anchor).toBeDefined();
    const fam = getFamilyWords(anchor!.id);
    const learned = [fam[0].id];
    const sats = getUnlearnedFamilyWords(anchor!.id, learned, 3);
    expect(sats.map(s => s.id)).not.toContain(fam[0].id);
    for (let i = 1; i < sats.length; i++) {
      expect(sats[i].word.length).toBeGreaterThanOrEqual(
        sats[i - 1].word.length,
      );
    }
  });
});

describe('收割（markWordHarvested）', () => {
  it('收割的词进入已学列表，首个复习间隔为 3 天', () => {
    const w = allWords[0];
    const p = markWordHarvested(getInitialProgress(), w.id);
    expect(p.completedWords).toContain(w.id);
    const review = p.wordReviews[w.id];
    expect(review.interval).toBe(3);
    expect(review.repetitions).toBe(1);
    const today = new Date().toISOString().split('T')[0];
    expect(review.nextReview > today).toBe(true);
    expect(p.totalScore).toBe(1);
  });
});
