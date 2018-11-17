import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParesExternosComponent } from './admin-pares-externos.component';

describe('AdminParesExternosComponent', () => {
  let component: AdminParesExternosComponent;
  let fixture: ComponentFixture<AdminParesExternosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminParesExternosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminParesExternosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
