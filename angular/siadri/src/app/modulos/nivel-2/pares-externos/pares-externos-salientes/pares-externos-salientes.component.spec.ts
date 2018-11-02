import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParesExternosSalientesComponent } from './pares-externos-salientes.component';

describe('ParesExternosSalientesComponent', () => {
  let component: ParesExternosSalientesComponent;
  let fixture: ComponentFixture<ParesExternosSalientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParesExternosSalientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParesExternosSalientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
