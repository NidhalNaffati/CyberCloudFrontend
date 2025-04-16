import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListComplaintsComponent } from './list-complaints.component';

describe('ListComplaintsComponent', () => {
  let component: ListComplaintsComponent;
  let fixture: ComponentFixture<ListComplaintsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListComplaintsComponent]
    });
    fixture = TestBed.createComponent(ListComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
