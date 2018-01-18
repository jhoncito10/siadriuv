import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovacionComponent } from './renovacion.component';

describe('RenovacionComponent', () => {
  let component: RenovacionComponent;
  let fixture: ComponentFixture<RenovacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenovacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenovacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
