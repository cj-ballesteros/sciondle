import { Component, signal } from '@angular/core';
import { HeaderComponent } from './header/header';
import { GameComponent } from './game/game';
import { Footer } from './footer/footer';
import { GameOptions } from './game-options/game-options';
import { InfiniteComponent } from './infinite/infinite';

type GameMode = 'menu' | 'daily' | 'infinite';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, GameComponent, Footer, GameOptions, InfiniteComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('angular-test-again');
  mode: GameMode = 'menu';

  selectMode(mode: GameMode): void {
    this.mode = mode;
  }
}
