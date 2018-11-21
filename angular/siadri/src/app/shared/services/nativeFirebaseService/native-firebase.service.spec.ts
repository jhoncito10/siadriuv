import { TestBed, inject } from '@angular/core/testing';

import { NativeFirebaseService } from './native-firebase.service';

describe('NativeFirebaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NativeFirebaseService]
    });
  });

  it('should be created', inject([NativeFirebaseService], (service: NativeFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
