import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationDashboardComponent } from './reservation-dashboard.component';

describe('ReservationDashboardComponent', () => {
  let component: ReservationDashboardComponent;
  let fixture: ComponentFixture<ReservationDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationDashboardComponent]
    });
    fixture = TestBed.createComponent(ReservationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
