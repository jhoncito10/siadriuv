import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDirectoresUvComponent } from './admin-directores-uv.component';

describe('AdminDirectoresUvComponent', () => {
  let component: AdminDirectoresUvComponent;
  let fixture: ComponentFixture<AdminDirectoresUvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDirectoresUvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDirectoresUvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
