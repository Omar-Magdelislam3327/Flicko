import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RecommendFilmModalComponent } from 'src/app/user-panel/recommend-film-modal/recommend-film-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
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
export class HomeComponent {
  sessionId: string;
  genres = [
    { id: 1, name: 'Action', image: 'assets\\vendors\\imgs\\action.png' },
    { id: 2, name: 'Drama', image: 'assets\\vendors\\imgs\\drama.png' },
    { id: 3, name: 'Horror', image: 'assets\\vendors\\imgs\\horror.png' },
    { id: 4, name: 'Comedy', image: 'assets\\vendors\\imgs\\comdey.png' },
    { id: 5, name: 'Adventure', image: 'assets\\vendors\\imgs\\adventure.png' }
  ];

  constructor(private modalService: NgbModal, private router: Router) {
    window.scrollTo(0, 0);
    this.sessionId = localStorage.getItem('session_id') || '';

    if (!this.sessionId) {
      this.router.navigate(['/login']);
    }
  }

  openRecommendFilmModal() {
    const modalRef = this.modalService.open(RecommendFilmModalComponent, { centered: true });
    modalRef.componentInstance.genres = this.genres;
  }
}
