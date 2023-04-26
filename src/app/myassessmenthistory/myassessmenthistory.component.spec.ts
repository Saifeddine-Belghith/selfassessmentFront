import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyassessmenthistoryComponent } from './myassessmenthistory.component';

describe('MyassessmenthistoryComponent', () => {
  let component: MyassessmenthistoryComponent;
  let fixture: ComponentFixture<MyassessmenthistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyassessmenthistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyassessmenthistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
