import { TestBed } from '@angular/core/testing';

import { StatisticsService } from './statistics-service.service';

describe('StatisticsServiceService', () => {
  let service: StatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
