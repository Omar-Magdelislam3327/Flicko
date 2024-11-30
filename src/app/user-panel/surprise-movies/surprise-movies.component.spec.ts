import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurpriseMoviesComponent } from './surprise-movies.component';

describe('SurpriseMoviesComponent', () => {
  let component: SurpriseMoviesComponent;
  let fixture: ComponentFixture<SurpriseMoviesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurpriseMoviesComponent]
    });
    fixture = TestBed.createComponent(SurpriseMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
