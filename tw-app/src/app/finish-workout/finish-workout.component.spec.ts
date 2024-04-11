import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishWorkoutComponent } from './finish-workout.component';

describe('FinishWorkoutComponent', () => {
  let component: FinishWorkoutComponent;
  let fixture: ComponentFixture<FinishWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinishWorkoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinishWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
