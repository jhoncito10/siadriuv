import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardInComponent } from './dashboard-in.component';

describe('DashboardInComponent', () => {
  let component: DashboardInComponent;
  let fixture: ComponentFixture<DashboardInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
