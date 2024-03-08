import { TestBed } from '@angular/core/testing';

import { SessionValidatorService } from './session-validator.service';

describe('SessionValidatorService', () => {
  let service: SessionValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
