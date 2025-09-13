import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private characterUrl = "http://localhost:5000/api/characters";
  private guessUrl = "http://localhost:5000/api";

  constructor(private http: HttpClient) { }

  searchCharacters(query: string): Observable<any> {
    return this.http.get<any[]>(`${this.characterUrl}?search=${query}`);
  }

  submitGuess(characterId: number) {
    console.log(characterId);
    return this.http.post<{ correct: boolean; character: any}>(
      `${this.guessUrl}/guess`,
      { characterId }
    );
  }
}
