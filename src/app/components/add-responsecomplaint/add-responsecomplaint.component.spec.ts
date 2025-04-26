import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddResponsecomplaintComponent } from './add-responsecomplaint.component';

describe('AddResponsecomplaintComponent', () => {
  let component: AddResponsecomplaintComponent;
  let fixture: ComponentFixture<AddResponsecomplaintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddResponsecomplaintComponent]
    });
    fixture = TestBed.createComponent(AddResponsecomplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
