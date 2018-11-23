import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPostSalientesComponent } from './admin-post-salientes.component';

describe('AdminPostSalientesComponent', () => {
  let component: AdminPostSalientesComponent;
  let fixture: ComponentFixture<AdminPostSalientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPostSalientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPostSalientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
