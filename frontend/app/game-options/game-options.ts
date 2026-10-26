
import { Component, output } from '@angular/core';
import { HTPComponent } from '../game/header-buttons/htp/htp';
import { OptionsComponent } from '../game/header-buttons/options/options';
import { PatchNotes } from '../game/header-buttons/patch-notes/patch-notes';

@Component({
  selector: 'app-game-options',
  imports: [
    HTPComponent,
    OptionsComponent,
    PatchNotes
  ],
  templateUrl: './game-options.html',
  styleUrl: './game-options.css',
})
export class GameOptions {
  modeSelected = output<'daily' | 'infinite'>();
}
