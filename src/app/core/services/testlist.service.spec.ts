import { TestBed, inject } from '@angular/core/testing';

import { TestlistService } from './testlist.service';

describe('TestlistService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestlistService]
    });
  });

  it('should be created', inject([TestlistService], (service: TestlistService) => {
    expect(service).toBeTruthy();
  }));
});
