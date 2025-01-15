import { TestBed } from '@angular/core/testing';

import { MorningAuthorisationService } from './morning-authorisation.service';

describe('MorningAuthorisationService', () => {
  let service: MorningAuthorisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MorningAuthorisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
