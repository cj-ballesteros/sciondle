import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgOptionTemplateDirective, NgSelectComponent} from '@ng-select/ng-select';
import {HttpClient} from '@angular/common/http';
import { GuessStorageService } from '../../services/guess_storage.service';
import {GuessResponse} from './searchjson.model';

@Component({
  selector: 'app-searchjson',
  imports: [
    FormsModule,
    NgOptionTemplateDirective,
    NgSelectComponent,
    ReactiveFormsModule
  ],
  templateUrl: './searchjson.html',
  styleUrl: './searchjson.css'
})
export class SearchJsonComponent implements OnInit {
  bosses: any[] = [];
  selected: any = null;
  alreadyGuessed: GuessResponse[] = [];

  @Output() characterSelected = new EventEmitter<any>();

  constructor(private http: HttpClient, private guessStorage: GuessStorageService) {
    this.alreadyGuessed = this.guessStorage.loadGuesses();
  }

  ngOnInit() {
    this.http.get<any[]>('data/raidBosses.json')
      .subscribe(data => {
        this.bosses = data;
        this.bosses = this.bosses.filter(
          c => !this.alreadyGuessed.some(g => g.guess.boss_id === c.boss_id)
        );
      });
  }

  submitSelection() {
    if (!this.selected) return;

    const character = this.bosses.find(c => c.id === this.selected);
    this.bosses = this.bosses.filter(c => c.id !== this.selected);

    this.characterSelected.emit(character);
  }
}
