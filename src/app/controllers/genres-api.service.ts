import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { genres } from '../modules/genres';
import { ApifunctionService } from './apifunction.service';
import { Observable } from 'rxjs/internal/Observable';
export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: Genre[];
}
@Injectable({
  providedIn: 'root'
})

export class GenresApiService {
  private apiUrl = 'https://api.themoviedb.org/3/genre/movie/list';
  private apiUrl2 = 'https://api.themoviedb.org/3/discover/movie';
  private apiKey = 'f44f7633f47aa38ad2e5299b05d49e52';
  constructor(public http: HttpClient) {
  }

  getGenres(): Observable<GenreResponse> {
    return this.http.get<GenreResponse>(`${this.apiUrl}?api_key=${this.apiKey}`);
  }

  // Get movies by genre ID
  getGenreById(genreId: number, page: number = 1): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl2}?api_key=${this.apiKey}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`
    );
  }
}
