import { TestBed } from '@angular/core/testing';

import { ServicesPageService } from './services-page.service';

describe('ServicesPageService', () => {
  let service: ServicesPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
