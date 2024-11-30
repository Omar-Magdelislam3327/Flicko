import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './user-panel/shared/navbar/navbar.component';
import { FooterComponent } from './user-panel/shared/footer/footer.component';
import { HomeComponent } from './user-panel/home/home.component';
import { Router } from '@angular/router';
import { MoviesComponent } from './user-panel/movies/movies.component';
import { MoviesopenComponent } from './user-panel/moviesopen/moviesopen.component';
import { SupportComponent } from './user-panel/support/support.component';
import { SubscriptionsComponent } from './user-panel/subscriptions/subscriptions.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GenresComponent } from './user-panel/genres/genres.component';
import { GenresopenComponent } from './user-panel/genresopen/genresopen.component';
import { RecommendedFilmsComponent } from './user-panel/recommended-films/recommended-films.component';
import { RecommendFilmModalComponent } from './user-panel/recommend-film-modal/recommend-film-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoadingWaveComponent } from './Interceptor/loading-wave/loading-wave.component';
import { LoadingInterceptor } from './Interceptor/loading.interceptor';
import { LoginComponent } from './access/login/login.component';
import { RegisterComponent } from './access/register/register.component';
import { ProfileComponent } from './user-panel/profile/profile.component';
import { SeriesComponent } from './user-panel/series/series.component';
import { MoviesByActorComponent } from './user-panel/movies-by-actor/movies-by-actor.component';
import { ToastrModule } from 'ngx-toastr';
import { UserPreferencesComponent } from './user-panel/user-preferences/user-preferences.component';
import { SurpriseMoviesComponent } from './user-panel/surprise-movies/surprise-movies.component';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    MoviesComponent,
    MoviesopenComponent,
    SupportComponent,
    SubscriptionsComponent,
    GenresComponent,
    GenresopenComponent,
    RecommendedFilmsComponent,
    RecommendFilmModalComponent,
    LoadingWaveComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    SeriesComponent,
    MoviesByActorComponent,
    UserPreferencesComponent,
    SurpriseMoviesComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    NgbModule,
    CarouselModule,
    NgxPaginationModule,
    ChartModule,
    ButtonModule,
    CardModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      timeOut: 3000,
      preventDuplicates: true,
      closeButton: false,
      progressAnimation: 'decreasing',
      progressBar: true,
      easing: 'linear',
    }),
    ToastModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
