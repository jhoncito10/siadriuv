import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarMenuDirectoresComponent } from './side-bar-menu-directores.component';

describe('SideBarMenuDirectoresComponent', () => {
  let component: SideBarMenuDirectoresComponent;
  let fixture: ComponentFixture<SideBarMenuDirectoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarMenuDirectoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarMenuDirectoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
