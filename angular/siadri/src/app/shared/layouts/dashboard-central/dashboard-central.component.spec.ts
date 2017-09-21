import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCentralComponent } from './dashboard-central.component';

describe('DashboardCentralComponent', () => {
  let component: DashboardCentralComponent;
  let fixture: ComponentFixture<DashboardCentralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardCentralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardCentralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
