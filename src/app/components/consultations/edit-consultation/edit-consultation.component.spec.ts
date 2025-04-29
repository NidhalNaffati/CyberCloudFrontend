import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsultationComponent } from './edit-consultation.component';

describe('EditConsultationComponent', () => {
  let component: EditConsultationComponent;
  let fixture: ComponentFixture<EditConsultationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditConsultationComponent]
    });
    fixture = TestBed.createComponent(EditConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
