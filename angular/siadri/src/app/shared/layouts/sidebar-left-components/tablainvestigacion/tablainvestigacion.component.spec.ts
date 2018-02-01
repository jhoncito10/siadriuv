import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablainvestigacionComponent } from './tablainvestigacion.component';

describe('TablainvestigacionComponent', () => {
  let component: TablainvestigacionComponent;
  let fixture: ComponentFixture<TablainvestigacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablainvestigacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablainvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
