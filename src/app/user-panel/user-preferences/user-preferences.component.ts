import { trigger, transition, style, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartData } from 'chart.js';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { FilmsApiService } from 'src/app/controllers/films-api.service';
import { GenresApiService, Genre } from 'src/app/controllers/genres-api.service';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  providers: [
    MessageService
  ]
})
export class UserPreferencesComponent implements OnInit {
  favorites: any[] = [];
  genreStats: any = {};
  mostPreferredGenre: string = '';
  mostPreferredGenreId: number = 0;
  totalFavorites: number = 0;
  genres: Genre[] = [];
  userName: string = '';
  genreData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#33FF57']
    }]
  };
  topActors: any[] = [];
  sessionId!: any;
  accountDetails!: any;
  mostPreferredActor: string = '';
  mostPreferredActorProfile: string = '';

  constructor(
    private api: FilmsApiService,
    private toastr: ToastrService,
    private genreApi: GenresApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService
  ) {
    window.scrollTo(0, 0);
    this.sessionId = localStorage.getItem('session_id') || '';
    if (!this.sessionId) {
      this.router.navigate(['/login']);
      return;
    }
    this.api.getAccountDetails(this.sessionId).subscribe(
      (data) => {
        this.accountDetails = data;
        localStorage.setItem('account_id', this.accountDetails.id);
        console.log('Account ID:', this.accountDetails.id);
        console.log(this.accountDetails)
      },
      (error) => {
        console.error('Error fetching account details:', error);
      }
    );
  }

  ngOnInit(): void {

    this.loadFavorites();
    this.loadGenres();
    this.calculateTopActors();
    this.getTrending();
    this.getUpcoming();
  }

  loadFavorites(): void {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      console.error('Session ID is missing.');
      return;
    }

    this.api.getFavorites(sessionId).subscribe(
      (response) => {
        this.favorites = response.results;
        console.log('Favorites:', this.favorites); // Check if favorites data is coming in as expected
        this.totalFavorites = this.favorites.length;
        this.calculateGenreStats();
        this.calculateTopActors();
      },
      (error) => {
        console.error('Error loading favorites:', error);
      }
    );
  }

  loadGenres(): void {
    this.genreApi.getGenres().subscribe(
      (response) => {
        this.genres = response.genres;
      },
      (error) => {
        console.error('Error loading genres:', error);
      }
    );
  }

  calculateGenreStats(): void {
    const genreCount: { [key: string]: number } = {};

    this.favorites.forEach(film => {
      film.genre_ids.forEach((genreId: number) => {
        const genreName = this.getGenreName(genreId);
        genreCount[genreName] = (genreCount[genreName] || 0) + 1;
      });
    });

    const sortedGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1]);

    this.mostPreferredGenre = sortedGenres[0] ? sortedGenres[0][0] : 'No preferred genre';
    this.mostPreferredGenreId = this.getGenreId(this.mostPreferredGenre);
    this.genreStats = genreCount;

    const colorPalette = [
      '#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#33FF57', '#FF914D', '#A3D8F4', '#8E44AD', '#F39C12',
      '#1ABC9C', '#2C3E50', '#E74C3C', '#9B59B6', '#F1C40F', '#16A085', '#27AE60', '#2980B9', '#8E44AD', '#34495E'
    ];

    const genreColors = Object.keys(genreCount).map((_, index) => colorPalette[index % colorPalette.length]);

    this.genreData = {
      labels: Object.keys(genreCount),
      datasets: [
        {
          data: Object.values(genreCount),
          backgroundColor: genreColors
        }
      ]
    };
  }

  getGenreName(genreId: number): string {
    const genre = this.genres.find(g => g.id === genreId);
    return genre ? genre.name : 'Unknown';
  }

  getGenreId(genreName: string): number {
    const genre = this.genres.find(g => g.name === genreName);
    return genre ? genre.id : 0;
  }

  calculateTopActors(): void {
    const actorCount: { [actorName: string]: { count: number, profile_path: string } } = {};

    this.favorites.forEach(film => {
      console.log('Film:', film);

      if (film.credits) {
        console.log('Credits:', film.credits);
        if (film.credits.cast && film.credits.cast.length > 0) {
          film.credits.cast.forEach((actor: any) => {
            console.log('Actor:', actor.name);
            if (!actorCount[actor.name]) {
              actorCount[actor.name] = {
                count: 0,
                profile_path: actor.profile_path || '/default-profile.jpg'
              };
            }
            actorCount[actor.name].count += 1;
          });
        } else {
          console.warn('No cast data found in film credits:', film);
        }
      } else {
        console.log(`Fetching credits for movie ${film.title} (ID: ${film.id})`);

        this.api.getCast(film.id).subscribe(
          (creditsResponse: any) => {
            console.log('Fetched Credits Response:', creditsResponse);
            film.credits = creditsResponse;

            if (creditsResponse.cast && creditsResponse.cast.length > 0) {
              creditsResponse.cast.forEach((actor: any) => {
                // console.log('Actor:', actor.name);
                if (!actorCount[actor.name]) {
                  actorCount[actor.name] = {
                    count: 0,
                    profile_path: actor.profile_path || '/default-profile.jpg'
                  };
                }
                actorCount[actor.name].count += 1;
              });
            } else {
              console.warn('No cast data found for movie:', film);
            }

            this.updateTopActors(actorCount);
          },
          (error) => {
            console.error(`Error fetching credits for movie ${film.title}:`, error);
          }
        );
      }
    });

    if (this.favorites.every(film => film.credits)) {
      this.updateTopActors(actorCount);
    }
  }

  updateTopActors(actorCount: { [actorName: string]: { count: number, profile_path: string } }): void {
    const sortedActors = Object.entries(actorCount)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8);

    this.topActors = sortedActors.map(([name, { count, profile_path }]) => ({
      name,
      movieCount: count,
      profile_path
    }));

    // Set the most preferred actor (actor with the highest count)
    if (sortedActors.length > 0) {
      this.mostPreferredActor = sortedActors[0][0];
      this.mostPreferredActorProfile = sortedActors[0][1].profile_path;
    }
  }

  surpriseMe(): void {
    if (!this.mostPreferredGenreId) {
      return;
    }

    this.genreApi.getGenreById(this.mostPreferredGenreId).subscribe(
      (response) => {
        const newMovies = response.results.filter((movie: any) =>
          !this.favorites.some(fav => fav.id === movie.id)
        );

        if (newMovies.length > 0) {
          this.messageService.add({
            severity: 'success',
            summary: 'Surprise!',
            detail: 'We found new movies based on your favourites.',
            life: 3000
          });

          newMovies.sort((a: any, b: any) => {
            const voteA = Number(a.vote_average) || 0;
            const voteB = Number(b.vote_average) || 0;
            return voteB - voteA;
          });

          sessionStorage.setItem('surprise', JSON.stringify(newMovies));
          setTimeout(() => sessionStorage.removeItem('surprise'), 1800000);

          this.router.navigate(['/surprise-movies']);
        } else {
          // Show Swal when no movies are found
          Swal.fire({
            title: 'No new movies found in this genre.',
            icon: 'info',
            showConfirmButton: false,
            timer: 1500,
            background: '#141414',
            color: '#FFFFFF',
          });
        }
      },
      (error) => {
        console.error('Error fetching top-rated movies:', error);
      }
    );
  }


  logout(): void {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#FF9999",
      cancelButtonColor: "#E50000",
      background: "#141414",
      color: "#FFFFFF",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('User logged out');
        localStorage.removeItem('session_id');
        this.router.navigate(['/login']);
      }
    });
  }
  //
  trendingMovies!: any[];
  getTrending() {
    this.api.getTrending().subscribe((data: any) => {
      this.trendingMovies = data.results.slice(0, 1);
      console.log(this.trendingMovies);
    })
  }
  upcoming!: any[];
  getUpcoming() {
    this.api.getUpcoming().subscribe((data: any) => {
      this.upcoming = data.results.slice(0, 1);
      console.log(this.upcoming);
    })
  }

}
