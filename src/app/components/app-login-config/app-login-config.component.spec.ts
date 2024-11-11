import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLoginConfigComponent } from './app-login-config.component';

describe('AppLoginConfigComponent', () => {
  let component: AppLoginConfigComponent;
  let fixture: ComponentFixture<AppLoginConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppLoginConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppLoginConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
