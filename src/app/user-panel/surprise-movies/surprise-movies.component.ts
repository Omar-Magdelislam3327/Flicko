import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-surprise-movies',
  templateUrl: './surprise-movies.component.html',
  styleUrls: ['./surprise-movies.component.css'],
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
export class SurpriseMoviesComponent implements OnInit, AfterViewInit {
  surpriseMovies: any[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    const storedMovies = sessionStorage.getItem('surprise');

    if (storedMovies) {
      this.surpriseMovies = JSON.parse(storedMovies);
    } else {
      console.log('No movies found in sessionStorage.');
    }
  }

  ngAfterViewInit(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Welcome to Surprise Movies',
      detail: 'Enjoy the best movies in the world!',
      life: 5000,
    });
  }
}
