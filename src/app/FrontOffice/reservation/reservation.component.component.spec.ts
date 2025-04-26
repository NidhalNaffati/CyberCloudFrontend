import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationComponentComponent } from './reservation.component';

describe('ReservationComponentComponent', () => {
  let component: ReservationComponentComponent;
  let fixture: ComponentFixture<ReservationComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationComponentComponent]
    });
    fixture = TestBed.createComponent(ReservationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
