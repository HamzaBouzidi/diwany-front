import { TestBed } from '@angular/core/testing';
import { ExitAuthorisationService } from './exit-authorisation.service';


describe('ExitAuthorisationService', () => {
  let service: ExitAuthorisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExitAuthorisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
