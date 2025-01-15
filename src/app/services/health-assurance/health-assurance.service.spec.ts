import { TestBed } from '@angular/core/testing';

import { HealthAssuranceService } from './health-assurance.service';

describe('HealthAssuranceService', () => {
  let service: HealthAssuranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthAssuranceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
