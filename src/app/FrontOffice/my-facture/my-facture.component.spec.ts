import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFactureComponent } from './my-facture.component';

describe('MyFactureComponent', () => {
  let component: MyFactureComponent;
  let fixture: ComponentFixture<MyFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyFactureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
