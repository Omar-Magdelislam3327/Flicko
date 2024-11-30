import { Component, HostListener, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { LoadingService } from './Interceptor/loading.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Flicko';
  showNavbar = true;
  showFooter = true;
  isLoading: Observable<boolean>;

  constructor(private loadingService: LoadingService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.isLoading = this.loadingService.isLoading$;
  }
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const route = this.getChildRoute(this.activatedRoute);
      const showNavbar = route?.snapshot?.data?.['showNavbar'] ?? true;
      const showFooter = route?.snapshot?.data?.['showFooter'] ?? true;

      this.showNavbar = showNavbar;
      this.showFooter = showFooter;
    });
  }

  private getChildRoute(route: ActivatedRoute): ActivatedRoute | null {
    if (route.firstChild) {
      return this.getChildRoute(route.firstChild);
    }
    return route;
  }

  @HostListener('document:contextmenu', ['$event'])
  disableRightClick(event: MouseEvent): void {
    event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  disableKeyboardShortcuts(event: KeyboardEvent): void {
    const forbiddenKeys = ['F12', 'I', 'J', 'U', 'C'];

    if (event.key === 'F12') {
      event.preventDefault();
    }

    if (event.ctrlKey && event.shiftKey && forbiddenKeys.includes(event.key)) {
      event.preventDefault();
    }

    if (event.ctrlKey && event.key === 'u') {
      event.preventDefault();
    }

    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
    }
  }

}
