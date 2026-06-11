import {describe, it, expect} from '@jest/globals';
import {getDailyTrivia, buildTriviaShareMessage} from '../src/data/dailyTrivia';
import wordOrigins from '../src/data/wordOrigins.json';

describe('今日词源冷知识（dailyTrivia）', () => {
  it('当天多次获取结果一致，且来自 wordOrigins', () => {
    const a = getDailyTrivia();
    const b = getDailyTrivia();
    expect(a).toEqual(b);
    const origins = wordOrigins as Record<string, string>;
    expect(origins[a.word]).toBe(a.story);
  });

  it('分享文案包含单词、故事和 slogan', () => {
    const t = getDailyTrivia();
    const msg = buildTriviaShareMessage(t);
    expect(msg).toContain(t.word);
    expect(msg).toContain(t.story);
    expect(msg).toContain('没有一个单词是凭空来的');
    expect(msg).toContain('WordPulse');
  });

  it('相邻几天取到不同的冷知识', () => {
    const realNow = Date.now;
    const seen = new Set<string>();
    try {
      for (let d = 0; d < 7; d++) {
        const fixed = realNow() + d * 86400000;
        Date.now = () => fixed;
        seen.add(getDailyTrivia().word);
      }
    } finally {
      Date.now = realNow;
    }
    expect(seen.size).toBe(7);
  });
});
