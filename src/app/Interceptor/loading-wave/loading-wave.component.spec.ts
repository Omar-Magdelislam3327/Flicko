import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingWaveComponent } from './loading-wave.component';

describe('LoadingWaveComponent', () => {
  let component: LoadingWaveComponent;
  let fixture: ComponentFixture<LoadingWaveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoadingWaveComponent]
    });
    fixture = TestBed.createComponent(LoadingWaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
