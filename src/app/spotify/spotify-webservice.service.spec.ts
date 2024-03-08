import { TestBed } from '@angular/core/testing';

import { SpotifyWebserviceService } from './spotify-webservice.service';

describe('SpotifyWebserviceService', () => {
  let service: SpotifyWebserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyWebserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
