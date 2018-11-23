import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarMenuPostulacionesComponent } from './side-bar-menu-postulaciones.component';

describe('SideBarMenuPostulacionesComponent', () => {
  let component: SideBarMenuPostulacionesComponent;
  let fixture: ComponentFixture<SideBarMenuPostulacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarMenuPostulacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarMenuPostulacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
