import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCursoModalComponent } from './editar-curso-modal.component';

describe('EditarCursoModalComponent', () => {
  let component: EditarCursoModalComponent;
  let fixture: ComponentFixture<EditarCursoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCursoModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCursoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
