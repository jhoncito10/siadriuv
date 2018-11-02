import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParesExternosComponent } from './pares-externos.component';

describe('ParesExternosComponent', () => {
  let component: ParesExternosComponent;
  let fixture: ComponentFixture<ParesExternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParesExternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParesExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
