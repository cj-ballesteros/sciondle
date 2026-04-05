import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class optionsService {
  colorblindMode = signal(false);
  private readonly COLORBLIND_KEY = 'xivdle_colorblind';

  constructor() {
    const colorblindStored = localStorage.getItem(this.COLORBLIND_KEY);
    if (colorblindStored) {
      this.colorblindMode.update(v => JSON.parse(colorblindStored));
    }
  }

  getMode() {
    return this.colorblindMode();
  }

  toggleColorblind() {
    this.colorblindMode.update(v => !v);
    localStorage.setItem(this.COLORBLIND_KEY, JSON.stringify(this.getMode()));
  }
}
