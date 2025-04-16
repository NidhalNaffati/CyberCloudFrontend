import { TestBed } from '@angular/core/testing';

import { ResponseComplaintService } from './response-complaint.service';

describe('ResponseComplaintService', () => {
  let service: ResponseComplaintService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseComplaintService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
