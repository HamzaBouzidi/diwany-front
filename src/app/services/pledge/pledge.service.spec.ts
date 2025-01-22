import { TestBed } from '@angular/core/testing';

import { PledgeService } from './pledge.service';

describe('PledgeService', () => {
  let service: PledgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PledgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
