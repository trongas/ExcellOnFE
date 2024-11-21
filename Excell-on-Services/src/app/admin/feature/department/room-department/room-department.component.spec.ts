import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDepartmentComponent } from './room-department.component';

describe('RoomDepartmentComponent', () => {
  let component: RoomDepartmentComponent;
  let fixture: ComponentFixture<RoomDepartmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomDepartmentComponent]
    });
    fixture = TestBed.createComponent(RoomDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
