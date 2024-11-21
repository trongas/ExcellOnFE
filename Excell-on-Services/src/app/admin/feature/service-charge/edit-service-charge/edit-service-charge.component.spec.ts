import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditServiceChargeComponent } from './edit-service-charge.component';

describe('EditServiceChargeComponent', () => {
  let component: EditServiceChargeComponent;
  let fixture: ComponentFixture<EditServiceChargeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditServiceChargeComponent]
    });
    fixture = TestBed.createComponent(EditServiceChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
