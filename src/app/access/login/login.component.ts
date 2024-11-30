import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FilmsApiService } from 'src/app/controllers/films-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent {
  username: string = '';
  password: string = '';
  passwordFieldType: string = 'password'; // Default to password field
  errorMessage: string = '';

  constructor(private api: FilmsApiService, private router: Router) { }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  login(): void {
    this.api.getRequestToken().subscribe((data: any) => {
      const requestToken = data.request_token;

      this.api.validateWithLogin(this.username, this.password, requestToken).subscribe(
        (response: any) => {
          this.api.createSession(requestToken).subscribe((sessionData: any) => {
            localStorage.setItem('session_id', sessionData.session_id);
            this.router.navigate(['/home']);
          });
        },
        (error) => {
          this.errorMessage = 'Invalid credentials, please try again.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            background: "#141414",
            text: this.errorMessage,
            confirmButtonText: 'Retry',
            confirmButtonColor: "#D92561",
            color: "#FFFFFF",
          });
        }
      );
    });
  }
  showSignupAlert(): void {
    Swal.fire({
      icon: 'info',
      title: 'Redirecting to TMDB Signup',
      text: 'You will be redirected to TMDB for registration. After creating an account, return here to login.',
      confirmButtonText: 'OK',
      background: '#141414',
      confirmButtonColor: '#D92561',
      color: '#FFFFFF',
      preConfirm: () => {
        window.open('https://www.themoviedb.org/signup', '_blank');
      }
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        console.log('Signup canceled');
      }
    });
  }
}
