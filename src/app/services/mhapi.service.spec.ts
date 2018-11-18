import { TestBed } from '@angular/core/testing';

import { MhapiService } from './mhapi.service';

describe('MhapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MhapiService = TestBed.get(MhapiService);
    expect(service).toBeTruthy();
  });
});
