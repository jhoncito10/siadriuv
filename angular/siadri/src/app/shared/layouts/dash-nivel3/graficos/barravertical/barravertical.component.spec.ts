import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarraverticalComponent } from './barravertical.component';

describe('BarraverticalComponent', () => {
  let component: BarraverticalComponent;
  let fixture: ComponentFixture<BarraverticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarraverticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarraverticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
