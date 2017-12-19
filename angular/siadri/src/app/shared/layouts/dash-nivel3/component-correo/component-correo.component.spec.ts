import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentCorreoComponent } from './component-correo.component';

describe('ComponentCorreoComponent', () => {
  let component: ComponentCorreoComponent;
  let fixture: ComponentFixture<ComponentCorreoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentCorreoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentCorreoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
