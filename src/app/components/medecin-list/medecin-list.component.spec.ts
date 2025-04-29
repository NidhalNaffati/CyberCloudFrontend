import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedecinList } from './medecin-list.component';

describe('MedecinListComponentComponent', () => {
  let component: MedecinList;
  let fixture: ComponentFixture<MedecinList>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MedecinList]
    });
    fixture = TestBed.createComponent(MedecinList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
