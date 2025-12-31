import { Component } from '@angular/core';
import {Character, GuessResponse} from './searchjson/searchjson.model';
import { GuessTableComponent } from './guess-table/guess-table';
import { ResultsComponent } from './results/results';
import { GuessStorageService } from '../services/guess_storage.service';
import { SearchJsonComponent } from './searchjson/searchjson';
import { ShareComponent } from './share/share';


@Component({
  selector: 'app-game',
  imports: [
    GuessTableComponent,
    ResultsComponent,
    SearchJsonComponent,
    ShareComponent
  ],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent {
  guesses: GuessResponse[] = [];
  correctAnswer!: Character;
  characters: Character[] = [];
  unmodifiedCharacters: Character[] = [];
  randomOrder: number[] = [13, 69, 17, 62, 60, 66, 48, 74, 86, 47,
    85, 6, 7, 19, 82, 61, 45, 83, 40, 0, 76, 52, 75, 68, 49, 31,
    53, 50, 73, 21, 57, 67, 16, 46, 18, 27, 70, 72, 10, 64, 65, 77,
    91, 11, 87, 9, 15, 14, 32, 42, 37, 25, 3, 56, 44, 2, 12, 54, 8,
    4, 29, 55, 84, 90, 28, 78, 26, 89, 51, 41, 20, 80, 38, 22, 93,
    34, 39, 92, 36, 71, 88, 33, 79, 23, 43, 1, 63, 59, 35, 30, 81,
    58, 94, 5, 24]
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

    laTime.setHours(laTime.getHours() - 21);

    const dateKey = laTime.toISOString().slice(0, 10);

    return dateKey
      .split('')
      .reduce((a, c) => a + c.charCodeAt(0), 0);
  };

  setCorrectAnswer() {
    const index = this.getGlobalSeed() % this.unmodifiedCharacters.length;
    this.correctAnswer = this.unmodifiedCharacters[this.randomOrder[index]];
    console.log(this.randomOrder.length);
    console.log(this.unmodifiedCharacters.length);
  }

  buildGuessResponse(guess: Character): GuessResponse {
    return {
      guess,
      answerId: this.correctAnswer.id,
      correct: guess.id === this.correctAnswer.id,

      comparison: {
        name: guess.name === this.correctAnswer.name,
        affiliation: guess.affiliation === this.correctAnswer.affiliation,
        current_job: guess.current_job === this.correctAnswer.current_job,
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

  compareNumber(guess: number, answer: number): 'higher' | 'lower' | 'equal' {
    if (guess === answer) return 'equal';
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
