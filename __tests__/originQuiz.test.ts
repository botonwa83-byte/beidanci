import {describe, it, expect} from '@jest/globals';
import {ORIGIN_QUIZ_ITEMS, buildOriginQuizQuestion} from '../src/data/originQuiz';
import {generateReviewQuestions} from '../src/data/learningLogic';
import {allWords, getWordOrigin} from '../src/data/wordDatabase';

describe('猜来历题型（originQuiz）', () => {
  it('每道题 4 个选项，词条都有身世故事可作答案揭晓', () => {
    const words = new Set<string>();
    for (const item of ORIGIN_QUIZ_ITEMS) {
      expect(item.choices).toHaveLength(4);
      expect(new Set(item.choices).size).toBe(4);
      expect(getWordOrigin(item.word)).toBeTruthy();
      words.add(item.word);
    }
    // 词条不重复
    expect(words.size).toBe(ORIGIN_QUIZ_ITEMS.length);
  });

  it('生成的题目恰好一个正确选项，揭晓文案是身世故事', () => {
    for (let i = 0; i < 20; i++) {
      const q = buildOriginQuizQuestion(1);
      expect(q.type).toBe('origin-quiz');
      expect(q.options).toHaveLength(4);
      expect(q.options.filter(o => o.isCorrect)).toHaveLength(1);
      expect(q.explanation.length).toBeGreaterThan(4);
      expect(q.wordId).toBeUndefined();
    }
  });

  it('复习流每场混入恰好一道猜来历，且 id 连续', () => {
    const qs = generateReviewQuestions(allWords.slice(0, 12), 10);
    expect(qs.filter(q => q.type === 'origin-quiz')).toHaveLength(1);
    qs.forEach((q, idx) => expect(q.id).toBe(idx + 1));
  });

  it('没有复习词时不出彩蛋题', () => {
    expect(generateReviewQuestions([], 10)).toHaveLength(0);
  });
});
