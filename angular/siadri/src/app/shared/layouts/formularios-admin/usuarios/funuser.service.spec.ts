import { TestBed, inject } from '@angular/core/testing';

import { FunuserService } from './funuser.service';

describe('FunuserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FunuserService]
    });
  });

  it('should be created', inject([FunuserService], (service: FunuserService) => {
    expect(service).toBeTruthy();
  }));
});
