import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css'],
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
export class SupportComponent {
  sessionId: string = '';
  constructor(private router: Router) { }
  ngOnInit() {
    this.sessionId = localStorage.getItem('session_id') || '';

    if (!this.sessionId) {
      this.router.navigate(['/login']);
    }
    window.scrollTo(0, 0);
  }
  contactFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  };
  isSubmitting = false;

  sendMessage(contactForm: any) {
    if (contactForm.invalid) {
      return;
    }

    Swal.fire({
      icon: 'info',
      title: 'Sending...',
      text: 'Your message is being sent, please wait.',
      showConfirmButton: false,
      background: "#141414",
      timer: 2000,
    });

    emailjs.send(
      'service_0u1y5ri',
      'template_rgrwkpx',
      this.contactFormData,
      '-q0r3upvmwwO1iQ6Y'
    ).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
        Swal.fire({
          icon: 'success',
          title: 'Thank you!',
          background: "#141414",
          text: 'Your message has been sent successfully.',
          confirmButtonText: 'Close',
          confirmButtonColor: "#E50000"
        });

        contactForm.resetForm();
      },
      (error) => {
        console.error('FAILED...', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          background: "#141414",
          text: 'Something went wrong. Please try again later.',
          confirmButtonText: 'Close',
          confirmButtonColor: "#E50000"
        });
      }
    );
  }
}
