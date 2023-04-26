import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewallassessmentComponent } from './viewallassessment.component';

describe('ViewallassessmentComponent', () => {
  let component: ViewallassessmentComponent;
  let fixture: ComponentFixture<ViewallassessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewallassessmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewallassessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
