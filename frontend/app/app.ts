import { Component, signal } from '@angular/core';
import {HeaderComponent} from './header/header';
import {GameComponent} from './game/game';
import {Footer} from './footer/footer';
import {GameOptions} from './game-options/game-options';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, GameComponent, Footer, GameOptions],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('angular-test-again');
}
