import { Component, signal } from '@angular/core';
import {HeaderComponent} from './header/header';
import {GameComponent} from './game/game';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, GameComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('angular-test-again');
}
