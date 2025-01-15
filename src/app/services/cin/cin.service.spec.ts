import { TestBed } from '@angular/core/testing';

import { CinService } from './cin.service';

describe('CinService', () => {
  let service: CinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
