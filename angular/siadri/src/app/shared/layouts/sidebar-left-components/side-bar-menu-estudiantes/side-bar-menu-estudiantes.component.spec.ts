import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarMenuEstudiantesComponent } from './side-bar-menu-estudiantes.component';

describe('SideBarMenuEstudiantesComponent', () => {
  let component: SideBarMenuEstudiantesComponent;
  let fixture: ComponentFixture<SideBarMenuEstudiantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarMenuEstudiantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarMenuEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
