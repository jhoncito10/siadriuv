import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantesPostulacionesComponent } from './estudiantes-postulaciones.component';

describe('EstudiantesPostulacionesComponent', () => {
  let component: EstudiantesPostulacionesComponent;
  let fixture: ComponentFixture<EstudiantesPostulacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstudiantesPostulacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstudiantesPostulacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
