import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOptionTemplateDirective, NgSelectComponent } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { GuessStorageService } from '../../services/guess_storage.service';
import { Character, GuessResponse } from './searchjson.model';

@Component({
  selector: 'app-searchjson',
  imports: [FormsModule, NgOptionTemplateDirective, NgSelectComponent, ReactiveFormsModule],
  templateUrl: './searchjson.html',
  styleUrl: './searchjson.css'
})
export class SearchJsonComponent implements OnInit {
  characters: Character[] = [];
  selected: number | null = null;
  alreadyGuessed: GuessResponse[] = [];

  /** When supplied, this list replaces Daily Mode's saved guesses. */
  @Input() excludedGuesses: GuessResponse[] | null = null;
  @Output() characterSelected = new EventEmitter<Character>();

  searchCharacter = (term: string, item: Character): boolean => {
    const query = term.trim().toLowerCase();
    return item.name?.toLowerCase().includes(query) || item.alias?.toLowerCase().includes(query) || false;
  };

  constructor(private http: HttpClient, private guessStorage: GuessStorageService) {}

  ngOnInit() {
    this.alreadyGuessed = this.excludedGuesses ?? this.guessStorage.loadGuesses();
    this.http.get<Character[]>('data/characters.json').subscribe(data => {
      this.characters = data.filter(c => !this.alreadyGuessed.some(g => g.guess.id === c.id));
    });
  }

  submitSelection() {
    if (this.selected === null) return;
    const character = this.characters.find(c => c.id === this.selected);
    if (!character) return;
    this.characters = this.characters.filter(c => c.id !== this.selected);
    this.selected = null;
    this.characterSelected.emit(character);
  }
}
