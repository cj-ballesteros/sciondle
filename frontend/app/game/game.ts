import { Component } from '@angular/core';
import { Character, GuessResponse } from './searchjson/searchjson.model';
import { GuessTableComponent } from './guess-table/guess-table';
import { ResultsComponent } from './results/results';
import { GuessStorageService } from '../services/guess_storage.service';
import { SearchJsonComponent } from './searchjson/searchjson';
import { ShareComponent } from './share/share';
import { HeaderButtons } from './header-buttons/header-buttons';
import { attributeMatch, jobMatch } from '../shared/attribute-match';

@Component({
  selector: 'app-game',
  imports: [
    GuessTableComponent,
    ResultsComponent,
    SearchJsonComponent,
    ShareComponent,
    HeaderButtons
  ],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent {
  guesses: GuessResponse[] = [];
  correctAnswer!: Character;
  characters: Character[] = [];
  unmodifiedCharacters: Character[] = [];
  randomOrder: number[] = [];
  // https://www.calculatorsoup.com/calculators/statistics/random-number-generator.php
  // adjust everytime a new character is added!!!
  // TODO: maybe add an automatic function for randomOrder
  game_over: boolean = false;

  constructor(private guessStorage: GuessStorageService) {
    this.game_over = this.guessStorage.loadGameState();
    this.guesses = this.guessStorage.loadGuesses();
  }

  ngOnInit() {
    this.loadCharacters();
  }

  onCharacterSelected(guess: Character) {
    const response: GuessResponse = this.buildGuessResponse(guess);
    this.add_guess(response);
  }

  private generateRandomOrder(length: number): number[] {
    const order = Array.from({ length }, (_, i) => i);

    // Deterministic shuffle: same length produces the same order.
    let seed = 12345;

    for (let i = order.length - 1; i > 0; i--) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }

    return order;
  }

  private validateCharacterPool(data: Character[]): boolean {
    const errors: string[] = [];

    // 1. Make sure characters.json contains an array.
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Character data is empty or invalid.');
      return false;
    }

    // 2. Check character IDs.
    const ids = data.map(c => c.id);
    const uniqueIds = new Set(ids);

    if (ids.some(id => !Number.isFinite(id))) {
      errors.push('One or more characters have a missing or invalid ID.');
    }

    if (uniqueIds.size !== ids.length) {
      errors.push('Duplicate character IDs detected.');
    }

    // 3. Check the daily ordering.
    const orderSet = new Set(this.randomOrder);

    if (this.randomOrder.length !== data.length) {
      errors.push(
        `randomOrder has ${this.randomOrder.length} entries, ` +
        `but there are ${data.length} characters.`
      );
    }

    if (orderSet.size !== this.randomOrder.length) {
      errors.push('randomOrder contains duplicate indexes.');
    }

    const invalidIndexes = this.randomOrder.filter(
      index =>
        !Number.isInteger(index) ||
        index < 0 ||
        index >= data.length
    );

    if (invalidIndexes.length > 0) {
      errors.push(
        `Invalid character indexes: ${invalidIndexes.join(', ')}`
      );
    }

    if (errors.length > 0) {
      console.error('Character pool validation failed:', errors);
      return false;
    }

    return true;
  }

  loadCharacters() {
    fetch('data/characters.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(
            `Failed to load characters.json: ${res.status}`
          );
        }

        return res.json();
      })
      .then((data: Character[]) => {

        this.randomOrder = this.generateRandomOrder(data.length);

        if (!this.validateCharacterPool(data)) {
          throw new Error('Character data failed validation.');
        }

        this.unmodifiedCharacters = data;
        this.characters = data.filter(
          c => !this.guesses.some(g => g.guess.id === c.id)
        );

        this.setCorrectAnswer();

        if (!this.correctAnswer) {
          throw new Error('No valid daily answer was selected.');
        }
      })
      .catch(error => {
        console.error('Unable to initialize game:', error);
        // TODO: Set a component error state so the UI displays
        // a helpful message instead of leaving the game unusable.
      });
  }

  getGlobalSeed(offsetDays = 0): string {
    const now = new Date();

    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Los_Angeles',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(now);

    const values = Object.fromEntries(
      parts.map(part => [part.type, part.value])
    );

    const today = `${values['year']}-${values['month']}-${values['day']}`;
    const date = new Date(`${today}T00:00:00Z`);

    date.setUTCDate(date.getUTCDate() + offsetDays);

    return date.toISOString().slice(0, 10);
  }

  getDayOffsetFromStart(dateKey: string): number {
    const start = new Date('2026-10-22T00:00:00Z');
    const current = new Date(dateKey + 'T00:00:00Z');

    return Math.floor(
      (current.getTime() - start.getTime()) / 86400000
    );
  }

  setCorrectAnswer(dateKey = this.getGlobalSeed()) {
    const characters = this.unmodifiedCharacters;

    if (characters.length === 0) {
      throw new Error('Cannot select an answer: no characters loaded.');
    }

    // 1. Check length first
    if (this.randomOrder.length !== characters.length) {
      throw new Error('randomOrder length does not match character count.');
    }

    // 2. Then check for duplicates and invalid indexes
    const isValidOrder =
      new Set(this.randomOrder).size === characters.length &&
      this.randomOrder.every(
        index =>
          Number.isInteger(index) &&
          index >= 0 &&
          index < characters.length
      );

    if (!isValidOrder) {
      throw new Error(
        'randomOrder must contain every character index exactly once.'
      );
    }

    // 3. Continue with daily answer selection
    const dayOffset = this.getDayOffsetFromStart(dateKey);
    const index =
      ((dayOffset % this.randomOrder.length) +
        this.randomOrder.length) %
      this.randomOrder.length;

    const characterIndex = this.randomOrder[index];
    const answer = characters[characterIndex];

    if (!answer) {
      throw new Error(`Invalid daily character index: ${characterIndex}`);
    }

    this.correctAnswer = answer;
  }

  getPreviousDayAnswer(): Character | undefined {
    const today = this.getGlobalSeed();
    const yesterdayDate = new Date(`${today}T00:00:00Z`);

    yesterdayDate.setUTCDate(yesterdayDate.getUTCDate() - 1);

    const yesterday = yesterdayDate.toISOString().slice(0, 10);

    if (yesterday < '2026-10-22') {
      return undefined;
    }

    const dayOffset = this.getDayOffsetFromStart(yesterday);
    const index =
      ((dayOffset % this.randomOrder.length) + this.randomOrder.length) %
      this.randomOrder.length;

    return this.unmodifiedCharacters[this.randomOrder[index]];
  }
  buildGuessResponse(guess: Character): GuessResponse {
    return {
      guess,
      answerId: this.correctAnswer.id,
      correct: guess.id === this.correctAnswer.id,

      comparison: {
        name: guess.name === this.correctAnswer.name,
        affiliation: attributeMatch(guess.affiliation, this.correctAnswer.affiliation),
        current_job: jobMatch(guess.current_job, this.correctAnswer.current_job),
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

  compareNumber(guess: number, answer: number): 'higher' | 'lower' | 'equal' | 'not_specified' {
    if (guess === answer) return 'equal';
    if (guess && !answer) return 'not_specified';
    return guess > answer ? 'lower' : 'higher';
  }

  private compareVersions(a: string, b: string): 'higher' | 'lower' | 'equal' {
    if (a === b) return 'equal';

    const toParts = (v: string) =>
      v.split('.').map(p => Number(p));

    const [majorA, minorA] = toParts(a);
    const [majorB, minorB] = toParts(b);

    if (majorA > majorB) return 'lower';
    if (majorA < majorB) return 'higher';

    if (minorA > minorB) return 'lower';
    if (minorA < minorB) return 'higher';

    return 'equal';
  }

  add_guess(guess: GuessResponse) {
    this.guesses.unshift(guess);

    if (guess.correct) {
      this.game_over = true;
      this.guessStorage.clearGuesses();
    }
    this.guessStorage.saveGuesses(this.guesses, this.game_over)
  }
}
