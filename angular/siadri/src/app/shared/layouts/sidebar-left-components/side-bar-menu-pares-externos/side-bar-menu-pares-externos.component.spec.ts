import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarMenuParesExternosComponent } from './side-bar-menu-pares-externos.component';

describe('SideBarMenuParesExternosComponent', () => {
  let component: SideBarMenuParesExternosComponent;
  let fixture: ComponentFixture<SideBarMenuParesExternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarMenuParesExternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarMenuParesExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
