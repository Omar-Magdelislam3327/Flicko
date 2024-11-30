import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendFilmModalComponent } from './recommend-film-modal.component';

describe('RecommendFilmModalComponent', () => {
  let component: RecommendFilmModalComponent;
  let fixture: ComponentFixture<RecommendFilmModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecommendFilmModalComponent]
    });
    fixture = TestBed.createComponent(RecommendFilmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
