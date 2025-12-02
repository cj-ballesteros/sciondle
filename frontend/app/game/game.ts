import { Component } from '@angular/core';
import {Character, GuessResponse} from './searchjson/searchjson.model';
import { GuessTableComponent } from './guess-table/guess-table';
import { ResultsComponent } from './results/results';
import { GuessStorageService } from '../services/guess_storage.service';
import { SearchJsonComponent } from './searchjson/searchjson';

@Component({
  selector: 'app-game',
  imports: [
    GuessTableComponent,
    ResultsComponent,
    SearchJsonComponent
  ],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent {
  guesses: GuessResponse[] = [];
  correctAnswer!: Character;
  characters: Character[] = [];
  unmodifiedCharacters: Character[] = [];
  game_over = false;

  constructor(private guessStorage: GuessStorageService) {
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
        this.setCorrectAnswer(); // pick correct answer *after* loading
      });
  }

  setCorrectAnswer() {
    this.correctAnswer = this.unmodifiedCharacters[2];
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
    return guess > answer ? 'higher' : 'lower';
  }

  private compareVersions(a: string, b: string): 'higher' | 'lower' | 'equal' {
    if (a === b) return 'equal';

    const toParts = (v: string) =>
      v.split('.').map(p => Number(p));

    const [majorA, minorA] = toParts(a);
    const [majorB, minorB] = toParts(b);

    if (majorA > majorB) return 'higher';
    if (majorA < majorB) return 'lower';

    if (minorA > minorB) return 'higher';
    if (minorA < minorB) return 'lower';

    return 'equal';
  }

  add_guess(guess: GuessResponse) {
    this.guesses.unshift(guess);
    this.guessStorage.saveGuesses(this.guesses)

    if (guess.correct) {
      this.correctAnswer = guess.guess
      this.game_over = true;
      this.guessStorage.clearGuesses();
    }
  }
}
