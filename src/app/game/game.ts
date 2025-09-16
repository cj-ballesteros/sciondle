import { Component } from '@angular/core';
import { GuessResponse } from './search/search.model';
import { SearchComponent } from './search/search';
import {GuessTableComponent} from './guess-table/guess-table';

@Component({
  selector: 'app-game',
  imports: [
    SearchComponent,
    GuessTableComponent
  ],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class GameComponent {
  guesses: GuessResponse[] = [];

  addGuess(guess: GuessResponse) {
    this.guesses.push(guess);
  }
}
