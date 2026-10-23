import { describe, it, expect, vi } from 'vitest';
import { SearchJsonComponent } from './searchjson';
import { GuessStorageService } from '../../services/guess_storage.service';
import { HttpClient } from '@angular/common/http';
import { Character } from './searchjson.model';

describe('Character alias search', () => {
  function createComponent() {
    const http = {} as HttpClient;

    const storage = {
      loadGuesses: vi.fn(() => [])
    } as unknown as GuessStorageService;

    return new SearchJsonComponent(http, storage);
  }

  const character = {
    id: 1,
    name: 'Wuk Lamat',
    alias: "Lamaty'i, Vow of Resolve",
    affiliation: [],
    current_job: [],
    race: 'Hrothgar',
    version_introduction: '6.0',
    image_url: 'wuk-lamat.png',
    age: 20,
    gender: 'Female',
    job_image_url: ''
  } satisfies Character;

  it('finds a character by name', () => {
    const component = createComponent();

    expect(component.searchCharacter('Wuk Lamat', character)).toBe(true);
  });

  it('finds a character by alias', () => {
    const component = createComponent();

    expect(component.searchCharacter("Lamaty'i", character)).toBe(true);
  });

  it('finds a character by part of an alias', () => {
    const component = createComponent();

    expect(component.searchCharacter('Resolve', character)).toBe(true);
  });

  it('searches without case sensitivity', () => {
    const component = createComponent();

    expect(component.searchCharacter('vOw oF rEsOlVe', character)).toBe(true);
  });

  it('does not match unrelated search terms', () => {
    const component = createComponent();

    expect(component.searchCharacter('Thancred', character)).toBe(false);
  });

  it('handles leading and trailing spaces', () => {
    const component = createComponent();

    expect(component.searchCharacter('  Wuk Lamat  ', character)).toBe(true);
  });

  it('matches the full alias containing a comma', () => {
    const component = createComponent();

    expect(
      component.searchCharacter("Lamaty'i, Vow of Resolve", character)
    ).toBe(true);
  });

  it('does not throw if the character has no alias', () => {
    const component = createComponent();
    const characterWithoutAlias = {
      ...character,
      alias: undefined
    };

    expect(
      component.searchCharacter('Wuk', characterWithoutAlias)
    ).toBe(true);

    expect(
      component.searchCharacter('Resolve', characterWithoutAlias)
    ).toBe(false);
  });
});
