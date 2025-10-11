import { Component, Input } from '@angular/core';
import { GuessResponse } from '../search/search.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-guess-table',
  imports: [ NgClass ],
  templateUrl: './guess-table.html',
  styleUrl: './guess-table.css'
})
export class GuessTableComponent {
  @Input() guesses: GuessResponse[] = [];
}
