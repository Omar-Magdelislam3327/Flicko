import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user-panel/home/home.component';
import { MoviesComponent } from './user-panel/movies/movies.component';
import { MoviesopenComponent } from './user-panel/moviesopen/moviesopen.component';
import { SupportComponent } from './user-panel/support/support.component';
import { GenresComponent } from './user-panel/genres/genres.component';
import { GenresopenComponent } from './user-panel/genresopen/genresopen.component';
import { RecommendedFilmsComponent } from './user-panel/recommended-films/recommended-films.component';
import { ProfileComponent } from './user-panel/profile/profile.component';
import { LoginComponent } from './access/login/login.component';
import { SeriesComponent } from './user-panel/series/series.component';
import { MoviesByActorComponent } from './user-panel/movies-by-actor/movies-by-actor.component';
import { UserPreferencesComponent } from './user-panel/user-preferences/user-preferences.component';
import { SurpriseMoviesComponent } from './user-panel/surprise-movies/surprise-movies.component';
import { AuthGuard } from './access/auth.guard';


const routes: Routes = [
  {
    path: "", redirectTo: "home", pathMatch: "full"
  },
  {
    path: 'home', component: HomeComponent, title: "Flicko / Home", canActivate: [AuthGuard]
  },
  {
    path: "login", component: LoginComponent, title: "Login", data: { showNavbar: false, showFooter: false }
  },
  {
    path: 'movies', component: MoviesComponent, title: "Flicko / Movies", canActivate: [AuthGuard]
  },
  {
    path: "series", component: SeriesComponent, title: "Flicko / Series", canActivate: [AuthGuard]
  },
  {
    path: 'show/:id', component: MoviesopenComponent, title: "Flicko / Movies", canActivate: [AuthGuard]
  },
  {
    path: "movies-by-actor/:actorId", component: MoviesByActorComponent, title: "Flicko / Movies", canActivate: [AuthGuard]
  },
  {
    path: 'support', component: SupportComponent, title: "Flicko / Support", canActivate: [AuthGuard]
  },
  {
    path: 'subscriptions', component: HomeComponent, title: "Flicko / Subscriptions", canActivate: [AuthGuard]
  },
  {
    path: "genres", component: GenresComponent, title: "Flicko / Genres", canActivate: [AuthGuard]
  },
  {
    path: "genre/:id", component: GenresopenComponent, title: "Flicko / Genres", canActivate: [AuthGuard]
  },
  {
    path: 'recommended-films', component: RecommendedFilmsComponent, canActivate: [AuthGuard], title: "Flicko / Recommended Movies"
  },
  {
    path: 'profile', component: UserPreferencesComponent, canActivate: [AuthGuard], title: "Flicko / Profile"
  },
  {
    path: 'surprise-movies', component: SurpriseMoviesComponent, canActivate: [AuthGuard], title: "Flicko / Surprise Movies"
  },
  {
    path: 'my-movies', component: ProfileComponent, title: "Flicko / My-Movies"
  },
  {
    path: "**", redirectTo: "home", pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule {

}
