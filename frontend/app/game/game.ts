import { Component } from '@angular/core';
import {Character, GuessResponse} from './searchjson/searchjson.model';
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
  randomOrder: number[] = [48, 86, 52, 49, 62, 6, 79, 90,
    57, 7, 88, 35, 46, 82, 24, 18, 4, 38, 75, 78, 45, 1,
    67, 40, 13, 20, 41, 21, 77, 26, 55, 25, 43, 29, 69,
    89, 73, 85, 37, 76, 56, 30, 51, 65, 17, 34, 44, 58,
    3, 33, 64, 81, 72, 63, 27, 66, 31, 39, 70, 96, 16,
    84, 91, 83, 87, 97, 60, 12, 92, 36, 5, 23, 9, 54, 50,
    28, 42, 53, 59, 71, 22, 80, 61, 47, 14, 15, 32, 10, 11,
    2, 93, 94, 74, 68, 95, 19, 8];
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

  getGlobalSeed = (): number => {
    const now = new Date();

    const laTime = new Date(
      now.toLocaleString('en-US', {
        timeZone: 'America/Los_Angeles'
      })
    );

    laTime.setHours(laTime.getHours() - 5);

    const dateKey = laTime.toISOString().slice(0, 10);

    return dateKey
      .split('')
      .reduce((a, c) => a + c.charCodeAt(0), 0);
  };

  setCorrectAnswer() {
    const index = (this.getGlobalSeed() + 7) % this.unmodifiedCharacters.length;
    this.correctAnswer = this.unmodifiedCharacters[this.randomOrder[index]];
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
