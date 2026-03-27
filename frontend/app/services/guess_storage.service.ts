import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GuessStorageService {
  constructor() {
    this.resetLocalStorageAt9pmPT();
  }

  private readonly STORAGE_KEY = 'xivdle_guesses';
  private readonly STATE_KEY = 'xivdle_state';

  saveGuesses(guesses: any[], game_over: boolean): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(guesses));
    localStorage.setItem(this.STATE_KEY, JSON.stringify(game_over));
  }

  loadGuesses(): any[] {
    const storedGuesses = localStorage.getItem(this.STORAGE_KEY);
    return storedGuesses ? JSON.parse(storedGuesses) : [];
  }

  loadGameState(): any {
    const storedGameState = localStorage.getItem(this.STATE_KEY);
    return storedGameState ? JSON.parse(storedGameState) : false;
  }

  clearGuesses(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  get9pmPTDayKey(): string {
    const now = new Date();

    const laTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
    );

    laTime.setHours(laTime.getHours() + 3);
    laTime.setDate(laTime.getDate());

    const year = laTime.getFullYear();
    const month = String(laTime.getMonth() + 1).padStart(2, '0');
    const day = String(laTime.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

   resetLocalStorageAt9pmPT(): void {
    const currentKey = this.get9pmPTDayKey();
    const storedKey = localStorage.getItem('xivdle_daykey');

    if (storedKey !== currentKey) {
      localStorage.clear();
      localStorage.setItem('xivdle_daykey', currentKey);
    }
  }

}
