import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeTranscriptionComponent } from './realtime-transcription.component';

describe('RealtimeTranscriptionComponent', () => {
  let component: RealtimeTranscriptionComponent;
  let fixture: ComponentFixture<RealtimeTranscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RealtimeTranscriptionComponent]
    });
    fixture = TestBed.createComponent(RealtimeTranscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
