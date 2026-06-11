import {describe, it, expect} from '@jest/globals';
import {
  computeDecipherPower,
  getKnownMorphemes,
  getMorphemeKey,
  getShowcaseWords,
} from '../src/data/decipherPower';
import {getInitialProgress} from '../src/data/learningLogic';
import {allWords} from '../src/data/wordDatabase';

describe('decipherPower', () => {
  it('morpheme key 归一化：连字符与大小写不影响等同性', () => {
    expect(getMorphemeKey({type: 'suffix', text: '-tion'})).toBe(
      getMorphemeKey({type: 'suffix', text: 'tion'}),
    );
    expect(getMorphemeKey({type: 'prefix', text: 'Re-'})).toBe(
      getMorphemeKey({type: 'prefix', text: 're'}),
    );
    // 类型参与区分
    expect(getMorphemeKey({type: 'root', text: 'in'})).not.toBe(
      getMorphemeKey({type: 'prefix', text: 'in-'}),
    );
  });

  it('零进度时破译力为零', () => {
    const power = computeDecipherPower(getInitialProgress());
    expect(power.decodableCount).toBe(0);
    expect(power.reachCount).toBe(0);
    expect(getShowcaseWords(power, 3)).toHaveLength(0);
  });

  it('碎片全部通过其他词学会后，该词可破译；已学词不计入', () => {
    // 找一个目标词：它的每块碎片都能在别的词里学到
    let targetId: number | null = null;
    let teachers: number[] = [];
    for (const w of allWords) {
      if (w.morphemes.length < 2) {
        continue;
      }
      const found: number[] = [];
      const ok = w.morphemes.every(m => {
        const key = getMorphemeKey(m);
        const teacher = allWords.find(
          o =>
            o.id !== w.id &&
            !found.includes(o.id) &&
            o.morphemes.some(om => getMorphemeKey(om) === key),
        );
        if (teacher) {
          found.push(teacher.id);
          return true;
        }
        return false;
      });
      if (ok) {
        targetId = w.id;
        teachers = found;
        break;
      }
    }
    expect(targetId).not.toBeNull();

    const progress = {...getInitialProgress(), completedWords: teachers};
    const known = getKnownMorphemes(progress);
    const target = allWords.find(w => w.id === targetId)!;
    expect(target.morphemes.every(m => known.has(getMorphemeKey(m)))).toBe(
      true,
    );

    const power = computeDecipherPower(progress);
    expect(power.decodableIds).toContain(targetId);
    // 已学词不算"可破译"
    for (const id of teachers) {
      expect(power.decodableIds).not.toContain(id);
    }
    expect(power.reachCount).toBe(teachers.length + power.decodableCount);
  });

  it('learnedRootIds 直接点亮词根碎片（含 a/b 变体）', () => {
    const progress = {...getInitialProgress(), learnedRootIds: ['port']};
    const known = getKnownMorphemes(progress);
    expect(known.has(getMorphemeKey({type: 'root', text: 'port'}))).toBe(true);
  });
});
