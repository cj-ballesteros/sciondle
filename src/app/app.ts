import { Component, signal } from '@angular/core';
import {HeaderComponent} from './header/header';
import {GameComponent} from './game/game';
import {Footer} from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, GameComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('angular-test-again');
}
