import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPricingComponent } from './services-pricing.component';

describe('ServicesPricingComponent', () => {
  let component: ServicesPricingComponent;
  let fixture: ComponentFixture<ServicesPricingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicesPricingComponent]
    });
    fixture = TestBed.createComponent(ServicesPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
