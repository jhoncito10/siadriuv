import { TestBed, async, inject } from '@angular/core/testing';

import { UnivalleGuard } from './univalle.guard';

describe('UnivalleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnivalleGuard]
    });
  });

  it('should ...', inject([UnivalleGuard], (guard: UnivalleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
