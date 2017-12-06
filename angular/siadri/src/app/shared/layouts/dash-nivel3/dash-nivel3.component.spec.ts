import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashNivel3Component } from './dash-nivel3.component';

describe('DashNivel3Component', () => {
  let component: DashNivel3Component;
  let fixture: ComponentFixture<DashNivel3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashNivel3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashNivel3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
