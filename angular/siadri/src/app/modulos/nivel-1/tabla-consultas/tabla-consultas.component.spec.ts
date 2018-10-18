import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaConsultasComponent } from './tabla-consultas.component';

describe('TablaConsultasComponent', () => {
  let component: TablaConsultasComponent;
  let fixture: ComponentFixture<TablaConsultasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaConsultasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
