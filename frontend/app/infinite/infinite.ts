
import { Component, inject } from '@angular/core';
import { Character, GuessResponse } from '../game/searchjson/searchjson.model';
import { SearchJsonComponent } from '../game/searchjson/searchjson';
import { GuessTableComponent } from '../game/guess-table/guess-table';
import { HeaderButtons } from '../game/header-buttons/header-buttons';
import { attributeMatch, jobMatch } from '../shared/attribute-match';
import type { InfiniteSettings } from '../services/infinite-settings.service';
import { InfiniteSettingsService } from '../services/infinite-settings.service';

interface InfiniteState {
  answerId: number | null;
  usedIds: number[];
  guesses: GuessResponse[];
  score: number;
  streak: number;
  bestStreak: number;
}

const DEFAULT_SETTINGS: InfiniteSettings = {
  races: [],
  genders: [],
  affiliations: [],
  jobs: [],
  expansionFilter: {
    mode: 'all',
    expansion: '2.0',
    startVersion: '2.0',
    endVersion: '7.0',
    includePrevious: true
  },
  lives: 5
};

const STORAGE_KEY = 'sciondle_infinite_state';

@Component({
  selector: 'app-infinite',
  imports: [
    HeaderButtons,
    SearchJsonComponent,
    GuessTableComponent
  ],
  templateUrl: './infinite.html',
  styleUrl: './infinite.css'
})
export class InfiniteComponent {
  characters: Character[] = [];
  correctAnswer!: Character;
  guesses: GuessResponse[] = [];
  usedIds: number[] = [];
  private infiniteSettingsService = inject(InfiniteSettingsService);

  score = 0;
  streak = 0;
  bestStreak = 0;

  roundComplete = false;
  roundLost = false;
  livesRemaining = DEFAULT_SETTINGS.lives;
  loading = true;
  errorMessage = '';

  settings: InfiniteSettings = { ...DEFAULT_SETTINGS };

  private restoredAnswerId: number | null = null;

  readonly DEFAULT_SETTINGS = DEFAULT_SETTINGS;

  constructor() {
    this.restoreState();

    fetch('data/characters.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(
                `Could not load character data (${response.status}).`
            );
          }

          return response.json() as Promise<Character[]>;
        })
        .then(characters => {
          if (!Array.isArray(characters) || characters.length === 0) {
            throw new Error('The character list is empty.');
          }

          this.characters = characters;

          this.infiniteSettingsService.setOptions({
            races: this.raceOptions,
            genders: this.genderOptions,
            affiliations: this.affiliationOptions,
            jobs: this.jobOptions
          });

          const restoredAnswer = this.characters.find(
              character => character.id === this.restoredAnswerId
          );

          if (restoredAnswer && this.matchesFilters(restoredAnswer)) {
            this.correctAnswer = restoredAnswer;
            this.roundComplete = this.guesses.some(guess => guess.correct);
            this.roundLost =
                this.roundComplete && !this.guesses.some(guess => guess.correct);

            this.livesRemaining = Math.max(
                0,
                this.settings.lives -
                this.guesses.filter(guess => !guess.correct).length
            );
          } else {
            this.startNextRound(false);
          }

          this.loading = false;
        })
        .catch(error => {
          console.error('Unable to initialize Infinite Mode:', error);
          this.errorMessage =
              'Could not load characters. Please refresh and try again.';
          this.loading = false;
        });
  }

  get raceOptions(): string[] {
    return this.uniqueValues(character => [character.race]);
  }

  get genderOptions(): string[] {
    return this.uniqueValues(character => [character.gender]);
  }

  get affiliationOptions(): string[] {
    return this.uniqueValues(character => character.affiliation ?? []);
  }

  get jobOptions(): string[] {
    return this.uniqueValues(character => character.current_job ?? []);
  }

  get expansionOptions(): string[] {
    return this.uniqueValues(
        character => [character.version_introduction]
    );
  }

  private uniqueValues(
      getValues: (character: Character) => string[]
  ): string[] {
    return [
      ...new Set(
          this.characters.flatMap(getValues).filter(Boolean)
      )
    ].sort((a, b) => a.localeCompare(b));
  }

  private matchesFilters(character: Character): boolean {
    const matches = (
        selected: string[],
        values: string[]
    ): boolean =>
        selected.length === 0 ||
        selected.some(value => values.includes(value));

    return (
        matches(this.settings.races, [character.race]) &&
        matches(this.settings.genders, [character.gender]) &&
        matches(
            this.settings.affiliations,
            character.affiliation ?? []
        ) &&
        matches(this.settings.jobs, character.current_job ?? []) &&
        this.matchesExpansionFilter(character)
    );
  }

  private matchesExpansionFilter(character: Character): boolean {
    const filter = this.settings.expansionFilter;

    if (filter.mode === 'all') {
      return true;
    }

    const version = character.version_introduction;

    if (!version || !this.isValidVersion(version)) {
      return false;
    }

    if (filter.mode === 'expansion') {
      const selectedMajor = this.getVersionParts(filter.expansion)[0];
      const characterMajor = this.getVersionParts(version)[0];

      if (filter.includePrevious) {
        return characterMajor <= selectedMajor;
      }

      return characterMajor === selectedMajor;
    }

    const start = filter.startVersion;
    const end = filter.endVersion;

    if (
        !this.isValidVersion(start) ||
        !this.isValidVersion(end) ||
        this.compareVersionValues(start, end) > 0
    ) {
      return false;
    }

    return (
        this.compareVersionValues(version, start) >= 0 &&
        this.compareVersionValues(version, end) <= 0
    );
  }

  private isValidVersion(version: string): boolean {
    return /^\d+\.\d+$/.test(version);
  }

  private getVersionParts(version: string): [number, number] {
    const [major, minor] = version.split('.').map(Number);
    return [major, minor];
  }

  private compareVersionValues(a: string, b: string): number {
    const [majorA, minorA] = this.getVersionParts(a);
    const [majorB, minorB] = this.getVersionParts(b);

    if (majorA !== majorB) {
      return majorA - majorB;
    }

    return minorA - minorB;
  }
  get availableCharacterCount(): number {
    return this.characters.filter(
        character => this.matchesFilters(character)
    ).length;
  }

  onInfiniteSettingsConfirmed(settings: InfiniteSettings): void {
    this.settings = {
      ...settings,
      races: [...settings.races],
      genders: [...settings.genders],
      affiliations: [...settings.affiliations],
      jobs: [...settings.jobs],
      expansionFilter: { ...settings.expansionFilter }
    };

    this.infiniteSettingsService.setSettings(this.settings);
    this.persistSettings();
    this.restartWithSettings();
  }

  private restartWithSettings(): void {
    this.guesses = [];
    this.roundComplete = false;
    this.roundLost = false;
    this.errorMessage = '';
    this.livesRemaining = this.settings.lives;

    // Keep the score and streak history, but start a new round.
    if (this.availableCharacterCount === 0) {
      this.correctAnswer = undefined!;
      this.persistState();
      return;
    }

    this.startNextRound(false);
  }

  private persistSettings(): void {
    try {
      localStorage.setItem(
          `${STORAGE_KEY}_settings`,
          JSON.stringify(this.settings)
      );
    } catch (error) {
      console.error('Unable to save Infinite Mode settings:', error);
    }
  }

  private restoreState(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const state = JSON.parse(stored) as Partial<InfiniteState>;

        this.restoredAnswerId =
            typeof state.answerId === 'number' ? state.answerId : null;

        this.usedIds = Array.isArray(state.usedIds)
            ? state.usedIds
            : [];

        this.guesses = Array.isArray(state.guesses)
            ? state.guesses
            : [];

        this.score = Number.isFinite(state.score) ? state.score! : 0;
        this.streak = Number.isFinite(state.streak) ? state.streak! : 0;
        this.bestStreak = Number.isFinite(state.bestStreak)
            ? state.bestStreak!
            : 0;
      }
    } catch {
      this.restoredAnswerId = null;
      this.usedIds = [];
      this.guesses = [];
      this.score = 0;
      this.streak = 0;
      this.bestStreak = 0;
    }

    try {
      const savedSettings = localStorage.getItem(
          `${STORAGE_KEY}_settings`
      );

      if (savedSettings) {
        const parsed = JSON.parse(
            savedSettings
        ) as Partial<InfiniteSettings>;

        this.settings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          races: Array.isArray(parsed.races) ? parsed.races : [],
          genders: Array.isArray(parsed.genders) ? parsed.genders : [],
          affiliations: Array.isArray(parsed.affiliations)
              ? parsed.affiliations
              : [],
          jobs: Array.isArray(parsed.jobs) ? parsed.jobs : [],
          expansionFilter: {
            ...DEFAULT_SETTINGS.expansionFilter,
            ...(parsed.expansionFilter ?? {})
          }
        };
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }

    this.infiniteSettingsService.setSettings(this.settings);
  }

  private persistState(): void {
    if (!this.correctAnswer) return;

    const state: InfiniteState = {
      answerId: this.correctAnswer.id,
      usedIds: this.usedIds,
      guesses: this.guesses,
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Unable to save Infinite Mode progress:', error);
    }
  }

  private startNextRound(addCurrentAnswerToUsed = true): void {
    if (!this.characters.length) return;

    if (
        addCurrentAnswerToUsed &&
        this.correctAnswer &&
        !this.usedIds.includes(this.correctAnswer.id)
    ) {
      this.usedIds.push(this.correctAnswer.id);
    }

    let available = this.characters.filter(
        character =>
            this.matchesFilters(character) &&
            !this.usedIds.includes(character.id)
    );

    if (!available.length) {
      // Start a new cycle using only characters matching the filters.
      this.usedIds = [];
      available = this.characters.filter(
          character => this.matchesFilters(character)
      );
    }

    if (!available.length) {
      this.errorMessage =
          'No characters match these filters. Change your settings to continue.';
      this.correctAnswer = undefined!;
      this.persistState();
      return;
    }

    this.errorMessage = '';
    this.correctAnswer =
        available[Math.floor(Math.random() * available.length)];

    this.restoredAnswerId = this.correctAnswer.id;
    this.guesses = [];
    this.roundComplete = false;
    this.roundLost = false;
    this.livesRemaining = this.settings.lives;

    this.persistState();
  }

  onCharacterSelected(guess: Character): void {
    if (this.roundComplete || !this.correctAnswer) return;

    const response = this.buildGuessResponse(guess);
    this.guesses = [response, ...this.guesses];

    if (response.correct) {
      this.score += 1;
      this.streak += 1;
      this.bestStreak = Math.max(this.bestStreak, this.streak);
      this.roundComplete = true;
    } else {
      this.streak = 0;

      if (this.settings.lives > 0) {
        this.livesRemaining -= 1;

        if (this.livesRemaining <= 0) {
          this.livesRemaining = 0;
          this.roundComplete = true;
          this.roundLost = true;
        }
      }
    }

    this.persistState();
  }

  nextRound(): void {
    if (this.roundComplete) {
      this.startNextRound();
    }
  }

  resetProgress(): void {
    this.usedIds = [];
    this.guesses = [];
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.roundComplete = false;
    this.roundLost = false;

    this.startNextRound(false);
  }


  private buildGuessResponse(guess: Character): GuessResponse {
    return {
      guess,
      answerId: this.correctAnswer.id,
      correct: guess.id === this.correctAnswer.id,
      comparison: {
        name: guess.name === this.correctAnswer.name,
        affiliation: attributeMatch(
            guess.affiliation,
            this.correctAnswer.affiliation
        ),
        current_job: jobMatch(
            guess.current_job,
            this.correctAnswer.current_job
        ),
        race: guess.race === this.correctAnswer.race,
        version_introduction: this.compareVersions(
            guess.version_introduction,
            this.correctAnswer.version_introduction
        ),
        age: this.compareNumber(
            guess.age,
            this.correctAnswer.age
        ),
        gender: guess.gender === this.correctAnswer.gender
      }
    };
  }

  private compareNumber(
      guess: number,
      answer: number
  ): 'higher' | 'lower' | 'equal' | 'not_specified' {
    if (guess === answer) return 'equal';
    if (guess && !answer) return 'not_specified';

    return guess > answer ? 'lower' : 'higher';
  }

  private compareVersions(
      a: string,
      b: string
  ): 'higher' | 'lower' | 'equal' {
    if (a === b) return 'equal';

    const [majorA = 0, minorA = 0] = a.split('.').map(Number);
    const [majorB = 0, minorB = 0] = b.split('.').map(Number);

    if (majorA !== majorB) {
      return majorA > majorB ? 'lower' : 'higher';
    }

    if (minorA !== minorB) {
      return minorA > minorB ? 'lower' : 'higher';
    }

    return 'equal';
  }
}
