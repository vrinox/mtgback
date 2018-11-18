import { TestBed } from '@angular/core/testing';

import { MtgService } from './mtg.service';

describe('MtgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MtgService = TestBed.get(MtgService);
    expect(service).toBeTruthy();
  });
});
