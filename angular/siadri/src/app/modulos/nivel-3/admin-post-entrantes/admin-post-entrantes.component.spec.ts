import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPostEntrantesComponent } from './admin-post-entrantes.component';

describe('AdminPostEntrantesComponent', () => {
  let component: AdminPostEntrantesComponent;
  let fixture: ComponentFixture<AdminPostEntrantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPostEntrantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPostEntrantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
