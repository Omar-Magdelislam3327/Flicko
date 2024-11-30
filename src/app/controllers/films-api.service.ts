import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { films } from '../modules/films';
import { ApifunctionService } from './apifunction.service';

@Injectable({
  providedIn: 'root'
})
export class FilmsApiService {
  private apiUrl = 'https://api.themoviedb.org/3/movie';
  private apiBaseUrl = 'https://api.themoviedb.org/3';
  private apiKey = 'f44f7633f47aa38ad2e5299b05d49e52';

  constructor(public http: HttpClient) { }

  // Get all films
  getAllFilms(): Observable<films[]> {
    return this.http.get<films[]>(`${this.apiUrl}/top_rated?api_key=${this.apiKey}`);
  }

  // Get film by ID
  getFilmById(filmId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${filmId}?api_key=${this.apiKey}`);
  }

  // Get films by page
  getFilmsByPage(page: number): Observable<any> {
    return this.http.get(
      `https://api.themoviedb.org/3/discover/movie?page=${page}&api_key=${this.apiKey}`
    );
  }


  // Get cast for a film
  getCast(filmId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${filmId}/credits?api_key=${this.apiKey}`);
  }

  // Get reviews for a film
  getReviews(filmId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${filmId}/reviews?api_key=${this.apiKey}`);
  }

  // Submit a review for a film
  submitReview(movieId: number, sessionId: string, rating: number): Observable<any> {
    const url = `${this.apiUrl}/${movieId}/rating`;

    const body = { value: rating };

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('session_id', sessionId);

    return this.http.post<any>(url, body, { params });
  }
  // get movies by actor
  getMoviesByActor(actorId: number) {
    return this.http.get(`https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${this.apiKey}`);
  }
  // get actor details
  getActorDetails(actorId: number): Observable<any> {
    return this.http.get<any>(`https://api.themoviedb.org/3/person/${actorId}?api_key=${this.apiKey}`);
  }

  // Get recommendations for a film
  getRecommendations(filmId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${filmId}/recommendations?api_key=${this.apiKey}`);
  }

  // Get currently playing films
  getCurrentPlayingFilms(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/now_playing?api_key=${this.apiKey}`);
  }

  // Get trailer for a film
  getTrailer(movieId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${movieId}/videos?api_key=${this.apiKey}`);
  }

  // Search for movies
  searchMovies(query: string): Observable<any> {
    return this.http.get<any>(`https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${this.apiKey}`);
  }

  // ==============================================================================================================

  // Get request token
  getRequestToken(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/authentication/token/new?api_key=${this.apiKey}`);
  }

  // Validate with login
  validateWithLogin(username: string, password: string, requestToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/authentication/token/validate_with_login?api_key=${this.apiKey}`, {
      username,
      password,
      request_token: requestToken
    });
  }

  // Create a session
  createSession(requestToken: string): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/authentication/session/new?api_key=${this.apiKey}`, {
      request_token: requestToken
    });
  }

  // Get account details
  getAccountDetails(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/account?api_key=${this.apiKey}&session_id=${sessionId}`);
  }

  // Get watchlist
  getWatchlist(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/account/{account_id}/watchlist/movies?api_key=${this.apiKey}&session_id=${sessionId}`);
  }

  // Get favorites
  getFavorites(sessionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/account/{account_id}/favorite/movies?api_key=${this.apiKey}&session_id=${sessionId}`);
  }

  // Add to watchlist
  addToWatchlist(movieId: number, sessionId: string): Observable<any> {
    const body = {
      media_type: 'movie',
      media_id: movieId,
      watchlist: true
    };
    const params = new HttpParams()
      .set('session_id', sessionId)
      .set('api_key', this.apiKey);

    return this.http.post<any>(`${this.apiBaseUrl}/account/{account_id}/watchlist`, body, { params });
  }
  removeFromWatchlist(movieId: number, sessionId: string): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    if (!accountId) {
      console.error('Account ID is missing. Ensure it is fetched during login.');
      throw new Error('Account ID not found.');
    }

    const url = `https://api.themoviedb.org/3/account/${accountId}/watchlist?session_id=${sessionId}&api_key=${this.apiKey}`;

    const body = {
      media_type: 'movie',
      media_id: movieId,
      watchlist: false,
    };

    console.log('Request URL:', url);
    console.log('Request Body:', body);

    return this.http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error during API call:', error);
        return throwError(() => new Error('Failed to remove movie from watchlist.'));
      })
    );
  }

  // Add to favorites
  addToFavorites(movieId: number, sessionId: string): Observable<any> {
    const body = {
      media_type: 'movie',
      media_id: movieId,
      favorite: true
    };
    const params = new HttpParams()
      .set('session_id', sessionId)
      .set('api_key', this.apiKey);

    return this.http.post<any>(`${this.apiBaseUrl}/account/{account_id}/favorite`, body, { params });
  }
  removeFromFavorites(movieId: number, sessionId: string): Observable<any> {
    const accountId = localStorage.getItem('account_id');
    if (!accountId) {
      console.error('Account ID is missing. Ensure it is fetched during login.');
      throw new Error('Account ID not found.');
    }

    const url = `https://api.themoviedb.org/3/account/${accountId}/favorite?session_id=${sessionId}&api_key=${this.apiKey}`;

    const body = {
      media_type: 'movie',
      media_id: movieId,
      favorite: false,
    };

    console.log('Request URL:', url);
    console.log('Request Body:', body);

    return this.http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error during API call:', error);
        return throwError(() => new Error('Failed to remove movie from favorites.'));
      })
    );
  }

  getTopRatedMoviesByGenre(genre: string): Observable<any> {
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.themoviedb.org/3/top_rated/movie?with_genres=${genre}&sort_by=popularity.desc&page=1&api_key=${apiKey}`;

    return this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching top-rated movies:', error);
        return throwError(() => new Error('Failed to fetch top-rated movies.'));
      })
    );
  }
  //
  getTrending(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/trending/movie/day?api_key=${this.apiKey}`);
  }
  getUpcoming(): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/movie/upcoming?api_key=${this.apiKey}`);
  }
}
