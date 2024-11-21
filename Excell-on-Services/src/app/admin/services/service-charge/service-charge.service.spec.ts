import { TestBed } from '@angular/core/testing';

import { ServiceChargeService } from './service-charge.service';

describe('ServiceChargeService', () => {
  let service: ServiceChargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceChargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
