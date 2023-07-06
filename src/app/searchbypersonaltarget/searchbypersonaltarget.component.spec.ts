import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbypersonaltargetComponent } from './searchbypersonaltarget.component';

describe('SearchbypersonaltargetComponent', () => {
  let component: SearchbypersonaltargetComponent;
  let fixture: ComponentFixture<SearchbypersonaltargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchbypersonaltargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchbypersonaltargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
