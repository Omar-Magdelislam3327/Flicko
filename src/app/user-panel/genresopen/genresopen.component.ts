import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmsApiService } from 'src/app/controllers/films-api.service';
import { GenresApiService } from 'src/app/controllers/genres-api.service';
import { genres } from 'src/app/modules/genres';

@Component({
  selector: 'app-genresopen',
  templateUrl: './genresopen.component.html',
  styleUrls: ['./genresopen.component.css'],
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
export class GenresopenComponent implements OnInit {
  id!: number;
  genre = new genres();
  filteredFilms: any[] = [];
  currentPage: number = 1;
  totalResults: number = 0;
  itemsPerPage: number = 20;
  fixed = 0;
  sessionId!: string;

  currentFilter: string = '';

  constructor(
    private api: GenresApiService,
    private activ: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('session_id') || '';

    if (!this.sessionId) {
      this.router.navigate(['/login']);
    }
    window.scrollTo(0, 0);
    this.id = +this.activ.snapshot.params['id'];

    this.api.getGenres().subscribe((data: any) => {
      this.genre = data.genres.find((g: any) => g.id === this.id);
      console.log('Genre:', this.genre);
    });

    this.fetchFilms();
  }

  fetchFilms(): void {
    this.api.getGenreById(this.id, this.currentPage).subscribe({
      next: (response: any) => {
        console.log('Films API Response:', response);
        this.filteredFilms = response.results.filter((g: any) => g.adult === false && g.backdrop_path !== null).sort((a: any, b: any) => b.release_date - a.release_date)
        this.totalResults = response.total_results;
        this.itemsPerPage = response.results.length;
        this.fixed = Math.ceil(this.totalResults / this.itemsPerPage);
        this.applyCurrentFilter();
      },
      error: (err) => {
        console.error('Error fetching films by genre:', err);
      }
    });
  }

  applyCurrentFilter(): void {
    switch (this.currentFilter) {
      case 'popularity':
        this.filteredFilms.sort((a: any, b: any) => b.popularity - a.popularity);
        break;
      case 'vote':
        this.filteredFilms.sort((a: any, b: any) => b.vote_average - a.vote_average);
        break;
      default:
        this.filteredFilms.sort((a: any, b: any) => b.release_date - a.release_date)
        break;
    }
  }

  filterByVote(): void {
    this.currentFilter = 'vote';
    this.fetchFilms();
  }

  filterByPopularity(): void {
    this.currentFilter = 'popularity';
    this.fetchFilms();
  }

  onSortChange(event: any): void {
    const selectedValue = event.target.value;
    switch (selectedValue) {
      case '1':
        this.filterByPopularity();
        break;
      case '2':
        this.filterByVote();
        break;
      default:
        this.currentFilter = '';
        this.fetchFilms();
        break;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo(0, 0);
    console.log('Page changed to:', this.currentPage);

    this.fetchFilms();
  }
}
