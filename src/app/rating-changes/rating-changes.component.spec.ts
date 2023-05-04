import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingChangesComponent } from './rating-changes.component';

describe('RatingChangesComponent', () => {
  let component: RatingChangesComponent;
  let fixture: ComponentFixture<RatingChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RatingChangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
