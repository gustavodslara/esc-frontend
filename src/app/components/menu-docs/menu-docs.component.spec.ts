import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDocsComponent } from './menu-docs.component';

describe('MenuDocsComponent', () => {
  let component: MenuDocsComponent;
  let fixture: ComponentFixture<MenuDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
