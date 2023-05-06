import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamAverageComponent } from './team-average.component';

describe('TeamAverageComponent', () => {
  let component: TeamAverageComponent;
  let fixture: ComponentFixture<TeamAverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamAverageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
