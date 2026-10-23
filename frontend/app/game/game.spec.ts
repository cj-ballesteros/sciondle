import { describe, it, expect, vi } from 'vitest';
import { GameComponent } from './game';
import { GuessStorageService } from '../services/guess_storage.service';
import { Character } from './searchjson/searchjson.model';

describe('Daily answer selection', () => {
  function createComponent() {
    const storage = {
      loadGameState: vi.fn(() => false),
      loadGuesses: vi.fn(() => [])
    } as unknown as GuessStorageService;

    const component = new GameComponent(storage);

    component.unmodifiedCharacters = Array.from(
      { length: 113 },
      (_, i) => ({ id: i }) as Character
    );

    component.randomOrder = Array.from(
      { length: 113 },
      (_, i) => i
    );

    return component;
  }

  it('selects the first character on the cycle start date', () => {
    const component = createComponent();

    component.setCorrectAnswer('2026-10-22');

    expect(component.correctAnswer.id).toBe(0);
  });

  it('selects a different character on the following day', () => {
    const component = createComponent();

    component.setCorrectAnswer('2026-01-01');
    const firstAnswer = component.correctAnswer.id;

    component.setCorrectAnswer('2026-01-02');
    const secondAnswer = component.correctAnswer.id;

    expect(secondAnswer).not.toBe(firstAnswer);
  });

  it('does not repeat answers during a complete cycle', () => {
    const component = createComponent();
    const selectedIds = new Set<number>();

    for (let day = 0; day < 113; day++) {
      const date = new Date(Date.UTC(2026, 0, 1 + day));
      const dateKey = date.toISOString().slice(0, 10);

      component.setCorrectAnswer(dateKey);
      selectedIds.add(component.correctAnswer.id);
    }

    expect(selectedIds.size).toBe(113);
  });

  it('throws if the ordering is incomplete', () => {
    const component = createComponent();
    component.randomOrder = [0, 1, 2];

    expect(() => component.setCorrectAnswer('2026-01-01'))
      .toThrow('randomOrder length does not match character count.');
  });

  it('selects the same answer when called repeatedly for the same date', () => {
    const component = createComponent();

    component.setCorrectAnswer('2026-01-15');
    const firstAnswer = component.correctAnswer.id;

    component.setCorrectAnswer('2026-01-15');

    expect(component.correctAnswer.id).toBe(firstAnswer);
  });

  it('throws if the ordering contains duplicate indexes', () => {
    const component = createComponent();

    component.randomOrder = Array.from(
      { length: 113 },
      (_, i) => i
    );

    // Replace the final index with a duplicate of index 0.
    component.randomOrder[112] = 0;

    expect(() => component.setCorrectAnswer('2026-01-01'))
      .toThrow('randomOrder must contain every character index exactly once.');
  });

  it('selects every character exactly once during a complete cycle', () => {
    const component = createComponent();
    const selectedIds: number[] = [];

    for (let day = 0; day < 113; day++) {
      const dateKey = new Date(Date.UTC(2026, 0, 1 + day))
        .toISOString()
        .slice(0, 10);

      component.setCorrectAnswer(dateKey);
      selectedIds.push(component.correctAnswer.id);
    }

    expect(new Set(selectedIds).size).toBe(113);
    expect(new Set(selectedIds)).toEqual(
      new Set(component.unmodifiedCharacters.map(character => character.id))
    );
  });

  it('returns the correct character for the previous day', () => {
    const component = createComponent();

    // Set the expected answer for yesterday
    component.setCorrectAnswer('2026-10-22');
    const yesterdayAnswer = component.correctAnswer;

    // Mock today's date as October 23, 2026
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-23T12:00:00-07:00'));

    try {
      const previousAnswer = component.getPreviousDayAnswer();

      expect(previousAnswer).toBeDefined();
      expect(previousAnswer?.id).toBe(yesterdayAnswer?.id);
    } finally {
      vi.useRealTimers();
    }
  });
});
