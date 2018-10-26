import { TestBed, inject } from '@angular/core/testing';

import { ConveniosService } from './convenios.service';

describe('ConveniosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConveniosService]
    });
  });

  it('should be created', inject([ConveniosService], (service: ConveniosService) => {
    expect(service).toBeTruthy();
  }));
});
