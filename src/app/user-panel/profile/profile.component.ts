import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilmsApiService } from 'src/app/controllers/films-api.service';
import Swal from 'sweetalert2';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  accountDetails: any = {};
  watchlist: any[] = [];
  favorites: any[] = [];
  sessionId: string = '';
  customOptions: any = {
    loop: true,
    margin: 10,
    nav: true,
    navText: ['<', '>'],
    navClass: ['custom-nav-left', 'custom-nav-right'],
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    drag: true,
    responsiveClass: true,
    dots: false,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      },
      1000: {
        items: 4
      }
    }
  };

  constructor(private api: FilmsApiService, private router: Router, private toastr: ToastrService, private messageService: MessageService) { }

  ngOnInit(): void {
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
      },
      (error) => {
        console.error('Error fetching account details:', error);
      }
    );

    this.getFavorites();
    this.getWatchlist();
  }

  getFavorites() {
    this.api.getFavorites(this.sessionId).subscribe((data) => {
      this.favorites = data.results.reverse();
    });
  }
  getWatchlist() {
    this.api.getWatchlist(this.sessionId).subscribe((data) => {
      this.watchlist = data.results.reverse();
    });
  }
  logOut() {
    localStorage.removeItem('session_id');
    this.router.navigate(['/login']);
  }
  removeFromWatchlist(film: any, event: Event): void {
    event.stopPropagation();

    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      console.error('Session ID is missing.');
      return;
    }

    this.api.removeFromWatchlist(film.id, sessionId).subscribe(
      (response) => {
        console.log('Movie removed from watchlist:', response);

        this.watchlist = this.watchlist.filter((m) => m.id !== film.id);
        Swal.fire({
          title: 'Success',
          text: `Film removed from Watchlist Succssfully`,
          icon: 'success',
          confirmButtonText: 'Close',
          confirmButtonColor: "#E50000",
          background: "#141414",
          color: "#FFFFFF",
        });
        // this.messageService.add({
        //   severity: 'success',
        //   summary: 'Watchlist',
        //   detail: 'Film removed from Watchlist Succssfully',
        //   key: 'watchlist-toast',
        //   life: 3000
        // });
      },
      (error) => {
        console.error('Error removing movie from watchlist:', error);

        this.toastr.error(`Failed to remove ${film.title} from your watchlist.`);
      }
    );
  }
  removeFromFavorites(film: any, event: Event): void {
    event.stopPropagation();

    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      console.error('Session ID is missing.');
      return;
    }

    this.api.removeFromFavorites(film.id, sessionId).subscribe(
      (response) => {
        console.log('Movie removed from favorites:', response);

        this.favorites = this.favorites.filter((m) => m.id !== film.id);
        // Swal.fire({
        //   title: 'Success',
        //   text: `Film removed from Favorites Succssfully`,
        //   icon: 'success',
        //   confirmButtonText: 'Close',
        //   confirmButtonColor: "#E50000",
        //   background: "#141414",
        //   color: "#FFFFFF",
        // })

      },
      (error) => {
        console.error('Error removing movie from favorites:', error);

        this.toastr.error(`Failed to remove ${film.title} from your favorites.`);
      }
    );
  }

}
