import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRemboursementComponent } from './list-remboursement.component';

describe('ListRemboursementComponent', () => {
  let component: ListRemboursementComponent;
  let fixture: ComponentFixture<ListRemboursementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListRemboursementComponent]
    });
    fixture = TestBed.createComponent(ListRemboursementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
