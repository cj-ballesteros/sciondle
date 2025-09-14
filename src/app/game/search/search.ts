import {Component} from '@angular/core';
import {
  NgOptionTemplateDirective,
  NgSelectComponent
} from '@ng-select/ng-select';
import {FormsModule} from '@angular/forms';
import {debounceTime, Observable, Subject, switchMap} from 'rxjs';
import {SearchService} from './search.service';
import {AsyncPipe} from '@angular/common';

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

  searchInput$ = new Subject<string>();
  characters$: Observable<any[]>;
  selected_character: any = null;

  constructor(private search_service: SearchService) {
    this.characters$ = this.searchInput$.pipe(
      debounceTime(300),
      switchMap((value) => this.search_service.searchCharacters(value || ""))
    );
  }

  on_submit() {
      this.search_service.submit_guess(this.selected_character).subscribe({
        next: (res) => {
          if (res.correct) {
            alert(`Correct! It was ${res.guess.name}`);
          } else {
            alert(`Wrong! You picked ${res.guess.name}\n` +
              `Affiliation match: ${res.comparison.affiliation}\n` +
              `Current job match: ${res.comparison.current_job}\n` +
              `Race match: ${res.comparison.race}\n` +
              `Version introduction match:${res.comparison.version_introduction}`
            );
          }
        },
      });
    }
}


