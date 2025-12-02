import { Component, Input } from '@angular/core';
import {Character, GuessResponse} from '../searchjson/searchjson.model';

@Component({
  selector: 'app-results',
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class ResultsComponent {
  @Input() correctAnswer!: Character;
  @Input() guesses!: GuessResponse[];
}
