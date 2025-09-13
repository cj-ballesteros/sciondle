import {Component, OnInit} from '@angular/core';
import {
  NgOptionTemplateDirective,
  NgSelectComponent
} from '@ng-select/ng-select';
import {FormControl, FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap} from 'rxjs';
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
  selectedCharacter: any = null;

  constructor(private searchService: SearchService) {
    this.characters$ = this.searchInput$.pipe(
      debounceTime(300),
      switchMap((value) => this.searchService.searchCharacters(value || ""))
    );
  }

  // onSubmit() {
  //   if (this.selectedCharacter) {
  //     console.log('Submitted value:', this.selectedCharacter);
  //   }
  // }
  onSubmit() {
    if (this.selectedCharacter) {
      this.searchService.submitGuess(this.selectedCharacter).subscribe({
        next: (res) => {
          if (res.correct) {
            alert(`Correct! It was ${res.character.name}.`);
          } else {
            alert(`Wrong! You picked ${res.character.name}.`);
          }
        },
        error: err => {
          console.error(err);
          alert("Something went wrong!");
        }
      })
    }
  }
}


