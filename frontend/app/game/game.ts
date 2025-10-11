import { Component } from '@angular/core';
import {Character, GuessResponse} from './search/search.model';
import { SearchComponent } from './search/search';
import { GuessTableComponent } from './guess-table/guess-table';
import {ResultsComponent} from './results/results';
import {GuessStorageService } from '../services/guess_storage.service';

@Component({
  selector: 'app-game',
  imports: [
    SearchComponent,
    GuessTableComponent,
    ResultsComponent
  ],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent {
  guesses: GuessResponse[] = [];
  correct_answer: Character | null = null;
  game_over = false;

  constructor(private guessStorage: GuessStorageService) {
    this.guesses = this.guessStorage.loadGuesses();
  }

  add_guess(guess: GuessResponse) {
    this.guesses.unshift(guess);
    this.guessStorage.saveGuesses(this.guesses)

    if (guess.correct) {
      this.correct_answer = guess.guess
      this.game_over = true;
      this.guessStorage.clearGuesses();
    }
  }
}
