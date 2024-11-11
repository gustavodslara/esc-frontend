import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSugestoesComponent } from './app-sugestoes.component';

describe('AppSugestoesComponent', () => {
  let component: AppSugestoesComponent;
  let fixture: ComponentFixture<AppSugestoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSugestoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSugestoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
