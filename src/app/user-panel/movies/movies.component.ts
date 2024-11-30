import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FilmsApiService } from 'src/app/controllers/films-api.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('400ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class MoviesComponent implements OnInit {
  films: any[] = [];
  newReleaseFilms: any[] = [];
  sessionId!: string;
  constructor(private api: FilmsApiService, private router: Router) {
  }

  ngOnInit() {
    this.sessionId = localStorage.getItem('session_id') || '';

    if (!this.sessionId) {
      this.router.navigate(['/login']);
    }
    window.scrollTo(0, 0);
    this.api.getAllFilms().subscribe((data: any) => {
      this.films = data.results;
      console.log(this.films);
      this.getCurrentFilms()
    });
  }
  getCurrentFilms() {
    this.api.getCurrentPlayingFilms().subscribe((data: any) => {
      this.newReleaseFilms = data.results
        .sort((a: any, b: any) => {
          const dateA = new Date(a.release_date);
          const dateB = new Date(b.release_date);
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 8);
      console.log(this.newReleaseFilms);
    });
  }

}
