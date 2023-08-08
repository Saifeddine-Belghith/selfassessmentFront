import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetRoleComponent } from './target-role.component';

describe('TargetRoleComponent', () => {
  let component: TargetRoleComponent;
  let fixture: ComponentFixture<TargetRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
