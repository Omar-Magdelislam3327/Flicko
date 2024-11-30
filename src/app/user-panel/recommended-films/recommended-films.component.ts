import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmsApiService } from '../../controllers/films-api.service';
import { films } from 'src/app/modules/films';
import { trigger, transition, style, animate } from '@angular/animations';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-recommended-films',
  templateUrl: './recommended-films.component.html',
  styleUrls: ['./recommended-films.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class RecommendedFilmsComponent implements OnInit {
  films: films[] = [];
  category1: number = 0;
  category2: number = 0;
  sessionId: string = '';
  constructor(
    private route: ActivatedRoute,
    private filmsApiService: FilmsApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('session_id') || '';

    if (!this.sessionId) {
      this.router.navigate(['/login']);
    }
    window.scrollTo(0, 0);

    this.route.queryParams.subscribe(params => {
      this.category1 = +params['category1'];
      this.category2 = +params['category2'];
      console.log('Received category1:', this.category1);
      console.log('Received category2:', this.category2);

      this.fetchAllFilms();
    });
  }

  fetchAllFilms(): void {
    const totalPages = 80;
    const requests = [];

    for (let page = 1; page <= totalPages; page++) {
      requests.push(this.filmsApiService.getFilmsByPage(page));
    }

    forkJoin(requests).subscribe(
      (responses: any[]) => {
        const allFilms = responses.flatMap(response => response.results);
        console.log("Fetched all films:", allFilms);

        this.films = allFilms.filter((film: any) => {
          if (!film.genre_ids) return false;

          const genreIds = film.genre_ids.map(Number);
          return genreIds.includes(this.category1) && genreIds.includes(this.category2);
        });

        console.log("Filtered films:", this.films);

        this.films.sort((a, b) => b.vote_average - a.vote_average);

        console.log("Sorted films by vote_average:", this.films);
      },
      (error) => {
        console.error("Error fetching films:", error);
      }
    );
  }

}
