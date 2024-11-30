import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FilmsApiService } from 'src/app/controllers/films-api.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;
import { FastAverageColor } from 'fast-average-color';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-moviesopen',
  templateUrl: './moviesopen.component.html',
  styleUrls: ['./moviesopen.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  providers: [MessageService]
})
export class MoviesopenComponent implements OnInit {

  id: any;
  film!: any;
  review!: any[];
  rating: number = 0;
  content: string = '';
  recommendations!: any[];
  cast!: any[]

  customOptions: any = {
    loop: true,
    margin: 10,
    nav: true,
    navText: ['<', '>'],
    navClass: ['custom-nav-left', 'custom-nav-right'],
    dots: false,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 3
      }
    }
  };
  trailerUrl!: SafeResourceUrl | null;
  sessionId!: any;
  //

  constructor(
    private api: FilmsApiService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
    private messageService: MessageService
  ) {
    window.scrollTo(0, 0);

  }

  ngOnInit(): void {
    this.sessionId = localStorage.getItem('session_id') || '';

    if (!this.sessionId) {
      this.router.navigate(['/login']);
    }
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.fetchFilmData();
    });
  }

  fetchFilmData(): void {
    this.api.getFilmById(this.id).subscribe((data: any) => {
      this.film = data;

      if (this.film.production_companies) {
        this.film.production_companies = this.film.production_companies.filter((f: any) => f.logo_path !== null).slice(0, 4);
      }

      if (this.film.genres) {
        this.film.genres = this.film.genres.slice(0, 4);
        this.film.genres = this.film.genres.map((genre: any) => {
          if (genre.name === "Science Fiction") {
            return { ...genre, name: "Ssc-Fic" };
          } else if (genre.name === "Documentary") {
            return { name: "Doc", id: genre.id };
          } else if (genre.name === "TV Movie") {
            return { name: "TV", id: genre.id };
          }
          return genre;
        });
      }

      console.log('Film data:', data);

      // Set the average color before loading the image
      this.setAverageColor(`https://image.tmdb.org/t/p/original${this.film.backdrop_path}`);

      // Set the image URL for later use
      this.imageUrl = `https://image.tmdb.org/t/p/original${this.film.backdrop_path}`;
    });

    this.api.getReviews(this.id).subscribe((data: any) => {
      this.review = data.results;
      console.log('Reviews:', this.review);
    });

    this.api.getRecommendations(this.id).subscribe((data: any) => {
      this.recommendations = data.results.filter((m: any) => m.poster_path !== null).slice(0, 8).sort((a: any, b: any) => b.vote_average - a.vote_average);
      console.log('Recommendations:', this.recommendations);
    });

    this.api.getCast(this.id).subscribe((data: any) => {
      this.cast = data.cast.filter((c: any) => c.profile_path).slice(0, 8);
      console.log('Cast:', this.cast);
    });
  }
  playTrailer(): void {
    this.api.getTrailer(this.id).subscribe((data: any) => {
      const trailer = data.results.find(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      );

      if (trailer) {
        const videoUrl = `https://www.youtube.com/embed/${trailer.key}`;
        this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);

        const modalElement = document.getElementById('trailerModal');
        if (modalElement) {
          const bootstrapModal = new bootstrap.Modal(modalElement);
          bootstrapModal.show();

          modalElement.addEventListener('hidden.bs.modal', () => {
            this.trailerUrl = null;
          });
        }
      } else {
        console.error('Trailer not found');
      }
    });
  }
  // ============================================================================
  addToWatchlist(): void {
    this.sessionId = localStorage.getItem('session_id');
    this.api.addToWatchlist(this.id, this.sessionId).subscribe(
      response => {
        console.log('Movie added to watchlist:', response);
        // Swal.fire({
        //   title: 'Success',
        //   text: 'Movie added to Watchlist',
        //   icon: 'success',
        //   confirmButtonText: 'Close',
        //   confirmButtonColor: "#E50000",
        //   background: "#141414",
        //   color: "#FFFFFF",
        // })
        this.messageService.add({
          severity: 'success',
          summary: 'Watchlist',
          detail: 'Movie added to your Watchlist.',
          key: 'watchlist-toast',
          life: 3000
        });
      },
      error => {
        console.error('Error adding to watchlist:', error);
      }
    );
  }

  addToFavorites(): void {
    this.sessionId = localStorage.getItem('session_id');
    this.api.addToFavorites(this.id, this.sessionId).subscribe(
      response => {
        console.log('Movie added to favorites:', response);
        // Swal.fire({
        //   title: 'Success',
        //   text: 'Movie added to Favorites',
        //   icon: 'success',
        //   confirmButtonText: 'Close',
        //   confirmButtonColor: "#E50000",
        //   background: "#141414",
        //   color: "#FFFFFF",
        // })
        this.messageService.add({
          severity: 'success',
          summary: 'Favorites',
          detail: 'Movie added to your Favorites.',
          key: 'favorites-toast',
          life: 3000
        });
      },
      error => {
        console.error('Error adding to favorites:', error);
        alert('Failed to add to Favorites');
      }
    );
  }
  //
  // submitReview(): void {
  //   if (this.rating < 0.5 || this.rating > 10) {
  //     alert('Rating must be between 0.5 and 10.');
  //     return;
  //   }

  //   this.api.submitReview(this.id, this.sessionId, this.rating).subscribe(
  //     (response) => {
  //       console.log('Review submitted:', response);
  //       this.fetchFilmData()
  //       this.resetForm();

  //     },
  //     (error) => {
  //       console.error('Error submitting review:', error);
  //       alert('Failed to submit review.');
  //     }
  //   );
  // }
  // resetForm(): void {
  //   this.rating = 0;
  //   this.content = '';
  //   const modal = document.getElementById('reviewModal') as HTMLElement;
  //   const modalInstance = bootstrap.Modal.getInstance(modal);
  //   modalInstance?.hide();
  // }
  // =============================================================================================================================
  moviesByActor: any[] = [];
  selectedActor: string = '';
  fetchMoviesByActor(actorId: number): void {
    this.api.getMoviesByActor(actorId).subscribe(
      (data: any) => {
        this.moviesByActor = data.cast;
        console.log('Movies by Actor:', this.moviesByActor);
        this.selectedActor = this.cast.find(c => c.id === actorId)?.name || 'Unknown Actor';
        this.router.navigate(['/movies-by-actor', actorId]);
      },
      (error) => {
        console.error('Error fetching movies by actor:', error);
      }
    );
  }
  //
  averageColor: string | null = null;
  imageUrl: string | null = null;
  imageLoaded: boolean = false;

  setAverageColor(imageUrl: string): void {
    const fac = new FastAverageColor();
    fac.getColorAsync(imageUrl).then(color => {
      this.averageColor = color.hex;
      console.log('Average color:', this.averageColor);
    }).catch((err) => {
      console.error('Error getting average color:', err);
      this.averageColor = '#1F1F1F';
    });
  }

  onImageLoad(): void {
    this.imageLoaded = true;
    console.log('Image loaded:', this.imageUrl);
  }
}
