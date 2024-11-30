import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FilmsApiService } from 'src/app/controllers/films-api.service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
declare var bootstrap: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchQuery: string = '';
  movies: any[] = [];
  modalStyle = { backgroundColor: 'var(--black8)', color: 'var(--grey95)' };
  searchSubject: Subject<string> = new Subject<string>();

  constructor(
    private api: FilmsApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.closeModal();
        this.collapseNavbar();
      }
    });

    this.searchSubject.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      switchMap((query) => this.api.searchMovies(query))
    ).subscribe(
      (data: any) => {
        this.movies = data.results.filter((m: any) => m.poster_path !== null && m.adult === false).sort((a: any, b: any) => b.vote_average - a.vote_average);
        console.log('Search Results:', this.movies);
      },
      (error) => {
        console.error('Error searching movies:', error);
      }
    );
  }

  openSearchModal(): void {
    this.collapseNavbar();
    const modalElement = document.getElementById('searchModal');
    if (modalElement) {
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();

      this.searchQuery = '';

      modalElement.addEventListener('hidden.bs.modal', () => {
        this.clearModal();
      });
    }
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  clearModal(): void {
    this.searchQuery = '';
    this.movies = [];
  }

  closeModal(): void {
    const modalElement = document.getElementById('searchModal');
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  // collapseNavbar(): void {
  //   const navbarToggler = document.getElementById('navbarToggler')!;
  //   if (navbarToggler && !navbarToggler.classList.contains('collapsed')) {
  //     navbarToggler.click();
  //   }
  // }
  @ViewChild('navbarToggler')
  navbarToggler!: ElementRef;

  collapseNavbar() {
    const navbarToggler = this.navbarToggler.nativeElement;
    if (!navbarToggler.classList.contains('collapsed')) {
      navbarToggler.click();
    }
  }
}
