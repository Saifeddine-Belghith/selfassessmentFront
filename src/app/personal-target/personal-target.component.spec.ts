import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalTargetComponent } from './personal-target.component';

describe('PersonalTargetComponent', () => {
  let component: PersonalTargetComponent;
  let fixture: ComponentFixture<PersonalTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
