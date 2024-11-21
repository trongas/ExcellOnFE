import { TestBed } from '@angular/core/testing';

import { ServiceManagementService } from './service-management.service';

describe('ServiceManagementService', () => {
  let service: ServiceManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
