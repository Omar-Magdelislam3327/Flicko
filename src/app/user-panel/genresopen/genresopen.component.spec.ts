import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresopenComponent } from './genresopen.component';

describe('GenresopenComponent', () => {
  let component: GenresopenComponent;
  let fixture: ComponentFixture<GenresopenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenresopenComponent]
    });
    fixture = TestBed.createComponent(GenresopenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
