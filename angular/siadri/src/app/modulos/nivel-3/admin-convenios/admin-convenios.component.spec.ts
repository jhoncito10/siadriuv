import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConveniosComponent } from './admin-convenios.component';

describe('AdminConveniosComponent', () => {
  let component: AdminConveniosComponent;
  let fixture: ComponentFixture<AdminConveniosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminConveniosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminConveniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
