import { Component, Input } from '@angular/core';
import { Exercise } from '../common/exercise';
import { StoreService } from '../common/store.service';
import { CommonModule } from '@angular/common';
import { Observable, of, map } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigateService } from '../common/navigate.service';
import { ViewEnum } from '../common/view.enum';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent {
  workoutForm!: FormGroup;
  exercises$: Observable<Exercise[]> = of([]);

  constructor(private storeService: StoreService, private fb: FormBuilder, private navigateService: NavigateService){}

  ngOnInit(): void {
    this.exercises$ = this.storeService.getExercises();

    this.workoutForm = this.fb.group({
      stepsFormArray: this.fb.array([])
    });

    this.exercises$.subscribe(exercises => {
      if(exercises){
        exercises[0].pending = true;
      }
      exercises.forEach((exercise, index) =>{
        this.stepsFormArray.push(this.createStepFormGroup(exercise))
      })
    }).unsubscribe();
  }

  get stepsFormArray(){
    return this.workoutForm.controls["stepsFormArray"] as FormArray;
  }

  createStepFormGroup(exercise: Exercise): FormGroup {
    return this.fb.group({
      exercise: exercise.name,
      reps: exercise.reps,
      sets: exercise.sets,
      pending: exercise.pending,
      stepInformationFormArray: this.fb.array(this.initStepInformation(exercise.sets))
    })
  }

  initStepInformation(sets: number): FormGroup[]{
    return Array.from({ length: sets }).map(() => {
      return this.fb.group({
        repsCompleted: [],
        intensity: []
      });
    });
  }

  getStepInformationFormArrayControls(index: number){
    const stepFormGroup = this.stepsFormArray.at(index) as FormGroup;
    return (stepFormGroup.get('stepInformationFormArray') as FormArray).controls;
  }

  markStepAsComplete(index: number){
    this.stepsFormArray.at(index+1).get('pending')?.setValue(true);
  }

  back(){
    this.navigateService.navigateTo(ViewEnum.Home);
  }
}
