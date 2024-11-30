import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesopenComponent } from './moviesopen.component';

describe('MoviesopenComponent', () => {
  let component: MoviesopenComponent;
  let fixture: ComponentFixture<MoviesopenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MoviesopenComponent]
    });
    fixture = TestBed.createComponent(MoviesopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
