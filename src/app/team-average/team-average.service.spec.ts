import { TestBed } from '@angular/core/testing';

import { TeamAverageService } from './team-average.service';

describe('TeamAverageService', () => {
  let service: TeamAverageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamAverageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
