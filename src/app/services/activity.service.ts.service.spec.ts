import { TestBed } from '@angular/core/testing';
import '~font-awesome/css/font-awesome.css';

import { ActivityService } from './activity.service';


describe('ActivityServiceTsService', () => {
  let service: ActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
