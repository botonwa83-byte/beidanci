import {describe, it, expect} from '@jest/globals';
import {generateQuestions} from '../src/data/learningLogic';
import {Question} from '../src/data/types';
import {getMorphemeKey} from '../src/data/decipherPower';
import {allWords} from '../src/data/wordDatabase';

describe('拼词工坊题型 (word-build)', () => {
  const multiMorphWords = allWords
    .filter(w => w.morphemes.length >= 2)
    .slice(0, 8);

  it('多碎片词的测验会生成 word-build 题，正确瓦片恰好等于该词碎片', () => {
    // 题型按下标轮换有随机性，多生成几轮保证覆盖
    let buildQs: Question[] = [];
    for (let round = 0; round < 5 && buildQs.length === 0; round++) {
      buildQs = generateQuestions(multiMorphWords, 8).filter(
        q => q.type === 'word-build',
      );
    }
    expect(buildQs.length).toBeGreaterThan(0);

    for (const q of buildQs) {
      const word = allWords.find(w => w.id === q.wordId)!;
      const correct = q.options.filter(o => o.isCorrect).map(o => o.text);
      expect(correct.sort()).toEqual(word.morphemes.map(m => m.text).sort());
      // 干扰瓦片不与正确碎片同形
      const correctKeys = new Set(word.morphemes.map(getMorphemeKey));
      for (const o of q.options.filter(opt => !opt.isCorrect)) {
        const lowered = o.text.toLowerCase().replace(/^-+|-+$/g, '');
        for (const key of correctKeys) {
          expect(key.split(':')[1]).not.toBe(lowered);
        }
      }
      // 至少 2 个干扰项
      expect(q.options.length - correct.length).toBeGreaterThanOrEqual(2);
    }
  });
});
