import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarMenuAdminDirectoresComponent } from './side-bar-menu-admin-directores.component';

describe('SideBarMenuAdminDirectoresComponent', () => {
  let component: SideBarMenuAdminDirectoresComponent;
  let fixture: ComponentFixture<SideBarMenuAdminDirectoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarMenuAdminDirectoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarMenuAdminDirectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
