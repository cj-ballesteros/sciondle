import { Component } from '@angular/core';
import {Boss, GuessResponse} from './searchjson/searchjson.model';
import { GuessTableComponent } from './guess-table/guess-table';
import { ResultsComponent } from './results/results';
import { GuessStorageService } from '../services/guess_storage.service';
import { SearchJsonComponent } from './searchjson/searchjson';
import { ShareComponent } from './share/share';
import { HeaderButtons } from './header-buttons/header-buttons';

@Component({
  selector: 'app-raid',
  imports: [
    GuessTableComponent,
    ResultsComponent,
    SearchJsonComponent,
    ShareComponent,
    HeaderButtons
  ],
  templateUrl: './raid.html',
  styleUrl: './raid.css'
})
export class RaidComponent {
  guesses: GuessResponse[] = [];
  correctAnswer!: Boss;
  bosses: Boss[] = [];
  unmodifiedBosses: Boss[] = [];
  randomOrder: number[] = [13, 69, 17, 62, 60, 66, 48, 74, 86, 47,
    85, 6, 7, 19, 82, 61, 45, 83, 40, 0, 76, 52, 75, 68, 49, 31,
    53, 50, 73, 21, 57, 67, 16, 46, 18, 27, 70, 72, 10, 64, 65, 77,
    91, 11, 87, 9, 15, 14, 32, 42, 37, 25, 3, 56, 44, 2, 12, 54, 8,
    4, 29, 55, 84, 90, 28, 78, 26, 89, 51, 41, 20, 80, 38, 22, 93,
    34, 39, 92, 36, 71, 88, 33, 79, 23, 43, 95, 1, 63, 59, 35, 30, 81,
    58, 94, 5, 24, 96, 97]
  // https://www.calculatorsoup.com/calculators/statistics/random-number-generator.php
  // adjust everytime a new character is added!!!
  // TODO: maybe add an automatic function for randomOrder
  game_over: boolean = false;

  constructor(private guessStorage: GuessStorageService) {
    this.game_over = this.guessStorage.loadGameState();
    this.guesses = this.guessStorage.loadGuesses();
  }

  ngOnInit() {
    this.loadBosses();
  }

  onBossSelected(guess: Boss) {
    const response: GuessResponse = this.buildGuessResponse(guess);
    this.add_guess(response);
  }

  loadBosses() {
    fetch('data/raidBosses.json')
      .then(res => res.json())
      .then(data => {
        this.bosses = data
        this.unmodifiedBosses = data;
        this.bosses = this.bosses.filter(
          c => !this.guesses.some(g => g.guess.boss_id === c.boss_id)
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
    const index = this.getGlobalSeed() % this.unmodifiedBosses.length;
    this.correctAnswer = this.unmodifiedBosses[this.randomOrder[index]];
  }

  buildGuessResponse(guess: Boss): GuessResponse {
    return {
      guess,
      answerId: this.correctAnswer.boss_id,
      correct: guess.boss_id === this.correctAnswer.boss_id,

      comparison: {
        boss_name: guess.boss_name === this.correctAnswer.boss_name,
        expansion: guess.expansion === this.correctAnswer.expansion,
        average_clear_time: guess.average_clear_time === this.correctAnswer.average_clear_time,
        boss_type: guess.boss_type === this.correctAnswer.boss_type,
        arena_type: guess.arena_type === this.correctAnswer.arena_type,
        encounter_features: guess.encounter_features === this.correctAnswer.encounter_features,
        fundamental_mechanics_featured: guess.fundamental_mechanics_featured === this.correctAnswer.fundamental_mechanics_featured,
        mechanics_featured: guess.mechanics_featured === this.correctAnswer.mechanics_featured,
      }
    };
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
