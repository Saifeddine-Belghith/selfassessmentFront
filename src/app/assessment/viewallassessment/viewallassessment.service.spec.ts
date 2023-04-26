import { TestBed } from '@angular/core/testing';

import { ViewallassessmentService } from './viewallassessment.service';

describe('ViewallassessmentService', () => {
  let service: ViewallassessmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewallassessmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
