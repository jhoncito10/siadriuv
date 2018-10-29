import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoresProgramaUvComponent } from './directores-programa-uv.component';

describe('DirectoresProgramaUvComponent', () => {
  let component: DirectoresProgramaUvComponent;
  let fixture: ComponentFixture<DirectoresProgramaUvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoresProgramaUvComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoresProgramaUvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
