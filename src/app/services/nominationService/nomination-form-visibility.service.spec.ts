import { TestBed } from '@angular/core/testing';

import { NominationFormVisibilityService } from './nomination-form-visibility.service';

describe('NominationFormVisibilityService', () => {
  let service: NominationFormVisibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominationFormVisibilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
