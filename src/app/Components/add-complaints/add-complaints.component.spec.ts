import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddComplaintsComponent } from './add-complaints.component';

describe('AddComplaintsComponent', () => {
  let component: AddComplaintsComponent;
  let fixture: ComponentFixture<AddComplaintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddComplaintsComponent]
    });
    fixture = TestBed.createComponent(AddComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
