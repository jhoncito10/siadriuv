import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashNivel2Component } from './dash-nivel2.component';

describe('DashNivel2Component', () => {
  let component: DashNivel2Component;
  let fixture: ComponentFixture<DashNivel2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashNivel2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashNivel2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
