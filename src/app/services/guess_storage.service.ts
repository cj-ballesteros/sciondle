// src/app/services/guess-storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GuessStorageService {
  private readonly STORAGE_KEY = 'xivdle_guesses';

  saveGuesses(guesses: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(guesses));
  }

  loadGuesses(): any[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  clearGuesses(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
