import {Component, EventEmitter, Output} from '@angular/core';
import {
  NgOptionTemplateDirective,
  NgSelectComponent
} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {debounceTime, Observable, Subject, switchMap} from 'rxjs';
import {SearchService} from './search.service';
import {AsyncPipe} from '@angular/common';
import {GuessResponse} from './search.model';

@Component({
  selector: 'app-search',
  imports: [
    NgSelectComponent,
    FormsModule,
    AsyncPipe,
    NgOptionTemplateDirective,
  ],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class SearchComponent {
  selected_character!: number;
  searchInput$ = new Subject<string>();
  characters$: Observable<any[]>;
  @Output() guessMade = new EventEmitter<GuessResponse>();

  constructor(private search_service: SearchService) {
    this.characters$ = this.searchInput$.pipe(
      debounceTime(300),
      switchMap((value) => this.search_service.search_characters(value || ""))
    );
  }

  on_submit() {
    if (!this.selected_character) return;

    this.search_service.submit_guess(this.selected_character).subscribe({
        next: (res) => this.guessMade.emit(res),
        error: (err) => console.error('Error submitting guess: ', err),
      });
    }
}


