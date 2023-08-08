import { TestBed } from '@angular/core/testing';

import { TargetRoleService } from './target-role.service';

describe('TargetRoleService', () => {
  let service: TargetRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TargetRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
