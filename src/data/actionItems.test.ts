import { describe, expect, it } from 'vitest';
import { CATEGORY_THEME } from '../constants';
import { actionItems } from './actionItems';

// actionItems.json is cast to ActionItems without runtime validation, so guard its integrity here.
describe('actionItems.json', () => {
  const { milestones, pointItems, durationItems } = actionItems;
  const categories = Object.keys(CATEGORY_THEME);

  it('uses only known categories', () => {
    for (const item of [...pointItems, ...durationItems]) {
      expect(categories, `${item.title}`).toContain(item.category);
    }
  });

  it('has milestones in order with valid week ranges', () => {
    milestones.forEach((m, i) => {
      expect(m.startWeek, m.id).toBeLessThanOrEqual(m.endWeek);
      if (i > 0) expect(m.startWeek, m.id).toBe(milestones[i - 1].endWeek + 1);
    });
  });

  it('links every point item to an existing milestone', () => {
    const ids = new Set(milestones.map((m) => m.id));
    for (const p of pointItems) expect(ids.has(p.weekGroup), p.title).toBe(true);
  });

  it('has unique point titles per milestone and unique duration ids', () => {
    const pointKeys = pointItems.map((p) => `${p.weekGroup}-${p.title}`);
    expect(new Set(pointKeys).size).toBe(pointKeys.length);
    const durationIds = durationItems.map((d) => d.id);
    expect(new Set(durationIds).size).toBe(durationIds.length);
  });

  it('has valid duration week ranges', () => {
    for (const d of durationItems) expect(d.startWeek, d.id).toBeLessThanOrEqual(d.endWeek);
  });
});
