import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { GenresApiService } from 'src/app/controllers/genres-api.service';

@Component({
  selector: 'app-recommend-film-modal',
  templateUrl: './recommend-film-modal.component.html',
  styleUrls: ['./recommend-film-modal.component.css']
})
export class RecommendFilmModalComponent implements OnInit {
  @Input() genres: { id: number, name: string, image: string }[] = [];
  category1: string = '';
  category2: string = '';

  constructor(
    public modal: NgbActiveModal,
    private router: Router,
    private api: GenresApiService
  ) { }

  ngOnInit(): void {
    this.getGenres()
  }
  getGenres() {
    this.api.getGenres().subscribe((data: any) => {
      this.genres = data.genres;
      console.log('Genres:', this.genres);
    });
  }

  recommendFilms() {
    this.modal.close();
    this.router.navigate(['/recommended-films'], {
      queryParams: { category1: this.category1, category2: this.category2 }
    });
  }
}
