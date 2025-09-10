import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar} from '@angular/material/toolbar';
import {Header} from './header/header';
import {Game} from './game/game';
import {SearchComponent} from './game/search/search';

@Component({
  selector: 'app-root',
  imports: [Header, Game, SearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  protected readonly title = signal('angular-test-again');
}
