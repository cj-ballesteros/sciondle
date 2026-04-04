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
  randomOrder: number[] = [27, 50, 98, 70, 32, 16, 24, 81, 35, 64, 58,
    49, 26, 60, 79, 55, 72, 39, 10, 44, 94, 7, 12, 33, 69, 63,
    84, 19, 42, 43, 54, 37, 31, 76, 56, 41, 15, 74, 90, 21, 25,
    78, 6, 8, 59, 4, 83, 73, 91, 29, 92, 57, 47, 75, 36, 2, 95,
    68, 46, 80, 77, 34, 71, 65, 85, 86, 18, 61, 14, 93, 13, 88,
    22, 82, 52, 23, 97, 48, 17, 62, 20, 87, 45, 96, 1, 40,
    30, 89, 3, 28, 67, 53, 38, 51, 5, 9, 66, 11];
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

  loadCharacters() {
    fetch('data/characters.json')
      .then(res => res.json())
      .then(data => {
        this.characters = data
        this.unmodifiedCharacters = data;
        this.characters = this.characters.filter(
          c => !this.guesses.some(g => g.guess.id === c.id)
        );
        this.setCorrectAnswer();
      });
  }

  getGlobalSeed(offsetDays = 0): string {
    const now = new Date();

    const laTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );

    laTime.setHours(laTime.getHours() + 3);
    laTime.setDate(laTime.getDate() + offsetDays);

    const year = laTime.getFullYear();
    const month = String(laTime.getMonth() + 1).padStart(2, '0');
    const day = String(laTime.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  getDayOffsetFromStart(dateKey: string): number {
    const start = new Date('2026-01-01T00:00:00Z');
    const current = new Date(dateKey + 'T00:00:00Z');

    return Math.floor((current.getTime() - start.getTime()) / 86400000);
  }


  setCorrectAnswer() {
    const index = this.getDayOffsetFromStart(this.getGlobalSeed(5)) % this.unmodifiedCharacters.length;
    this.correctAnswer = this.unmodifiedCharacters[this.randomOrder[index]];
  }

  getPreviousDayAnswer() {
    const index = this.getDayOffsetFromStart(this.getGlobalSeed(5))  % this.unmodifiedCharacters.length;
    if (!this.randomOrder[index - 1]){
      return this.unmodifiedCharacters[this.randomOrder[this.randomOrder.length - 1]];
    } else return this.unmodifiedCharacters[this.randomOrder[index - 1]];
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
