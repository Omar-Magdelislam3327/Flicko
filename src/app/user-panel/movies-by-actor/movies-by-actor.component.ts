import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilmsApiService } from 'src/app/controllers/films-api.service';

@Component({
  selector: 'app-movies-by-actor',
  templateUrl: './movies-by-actor.component.html',
  styleUrls: ['./movies-by-actor.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class MoviesByActorComponent {
  movies: any[] = [];
  selectedActor: string = '';
  currentPage: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 20;
  fixed = 0;
  constructor(private api: FilmsApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const actorId = +params.get('actorId')!;
      if (actorId) {
        this.fetchMoviesByActor(actorId);
        this.fetchActorData(actorId);
      }
    });
  }

  fetchMoviesByActor(actorId: number): void {
    this.api.getMoviesByActor(actorId).subscribe(
      (data: any) => {
        this.movies = data.cast
          .filter((m: any) => m.poster_path !== null)
          .sort((a: any, b: any) => b.popularity - a.popularity);

        this.totalResults = data.total_results;
        this.itemsPerPage = this.movies.length;
        this.fixed = Math.ceil(this.totalResults / this.itemsPerPage);

        console.log('Movies by Actor (sorted by popularity):', this.movies);
        this.selectedActor = data.name;
      },
      (error) => {
        console.error('Error fetching movies by actor:', error);
      }
    );
  }

  fetchActorData(actorId: number): void {
    this.api.getActorDetails(actorId).subscribe(
      (data: any) => {
        this.selectedActor = data.name;
        console.log('Actor Data:', data);
      },
      (error) => {
        console.error('Error fetching actor data:', error);
      }
    );
  }
}
