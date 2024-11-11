import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMatrizComponent } from './app-matriz.component';

describe('AppMatrizComponent', () => {
  let component: AppMatrizComponent;
  let fixture: ComponentFixture<AppMatrizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMatrizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppMatrizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
