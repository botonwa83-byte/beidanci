import {describe, it, expect} from '@jest/globals';
import {allWords, getFullMeaning} from '../src/data/wordDatabase';
import wordSenses from '../src/data/wordSenses.json';

describe('多义项（wordSenses）', () => {
  it('transmission 不止"传输"，还有变速箱等义项', () => {
    const w = allWords.find(x => x.word === 'transmission');
    expect(w).toBeDefined();
    expect(w!.meanings.length).toBeGreaterThan(1);
    expect(w!.meanings.some(m => m.includes('变速箱'))).toBe(true);
    expect(getFullMeaning(w!)).toContain('；');
    expect(getFullMeaning(w!)).toContain('变速箱');
  });

  it('wordSenses 收录的高频词都合并进了 meanings', () => {
    const senses = wordSenses as Record<string, string[]>;
    const byWord = new Map(allWords.map(w => [w.word.toLowerCase(), w]));
    let merged = 0;
    for (const [word, list] of Object.entries(senses)) {
      const w = byWord.get(word.toLowerCase());
      if (w) {
        expect(w.meanings).toEqual(list);
        merged++;
      }
    }
    // 绝大多数收录词应存在于词库（编写自词库高频词导出）
    expect(merged).toBeGreaterThan(250);
  });

  it('未收录的词保持原 meanings，getFullMeaning 回退 meaning', () => {
    const senses = wordSenses as Record<string, string[]>;
    const w = allWords.find(
      x => !senses[x.word.toLowerCase()] && x.meanings.length === 1,
    );
    expect(w).toBeDefined();
    expect(getFullMeaning(w!)).toBe(w!.meaning);
  });
});
