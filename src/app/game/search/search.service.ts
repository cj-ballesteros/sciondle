import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Character, GuessResponse} from './search.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private characterUrl = "http://localhost:5000/api/characters";
  private guessUrl = "http://localhost:5000/api";

  constructor(private http: HttpClient) { }

  search_characters(query: string): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.characterUrl}?search=${query}`);
  }

  submit_guess(character_id: number) {
    console.log(character_id);
    return this.http.post<GuessResponse>(
      `${this.guessUrl}/guess`,
      { character_id }
    );
  }
}
