import { TestBed } from '@angular/core/testing';

import { ClientfeedbackService } from './clientfeedback/clientfeedback.service';

describe('ClientfeedbackService', () => {
  let service: ClientfeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientfeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
