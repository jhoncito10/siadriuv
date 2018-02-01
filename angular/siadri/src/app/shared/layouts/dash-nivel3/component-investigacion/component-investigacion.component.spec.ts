import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentInvestigacionComponent } from './component-investigacion.component';

describe('ComponentInvestigacionComponent', () => {
  let component: ComponentInvestigacionComponent;
  let fixture: ComponentFixture<ComponentInvestigacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentInvestigacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentInvestigacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
