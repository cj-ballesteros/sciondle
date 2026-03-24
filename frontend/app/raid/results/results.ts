import { Component, Input } from '@angular/core';
import {Boss, GuessResponse} from '../searchjson/searchjson.model';

@Component({
  selector: 'app-results',
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class ResultsComponent {
  @Input() correctAnswer!: Boss;
  @Input() guesses!: GuessResponse[];

  ngOnInit(): void {}
}
