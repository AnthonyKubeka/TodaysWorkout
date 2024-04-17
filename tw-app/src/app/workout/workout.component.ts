import { Component, Input } from '@angular/core';
import { Exercise } from '../common/exercise';
import { StoreService } from '../common/store.service';
import { CommonModule } from '@angular/common';
import { Observable, of, map, take } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigateService } from '../common/navigate.service';
import { ViewEnum } from '../common/view.enum';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonStandardComponent],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent {
  workoutForm!: FormGroup;
  exercises$: Observable<Exercise[]> = of([]);

  constructor(private storeService: StoreService, private fb: FormBuilder, private navigateService: NavigateService){}

  ngOnInit(): void {
    this.exercises$ = this.storeService.getExercises().pipe(take(1));

    this.workoutForm = this.fb.group({
      stepsFormArray: this.fb.array([])
    });

    this.exercises$.pipe(take(1)).subscribe(exercises => {
      if(exercises){
        exercises[0].pending = true;
      }
      exercises.forEach((exercise) =>{
        this.stepsFormArray.push(this.createStepFormGroup(exercise))
      })
    });
  }

  get stepsFormArray(){
    return this.workoutForm.controls["stepsFormArray"] as FormArray;
  }

  createStepFormGroup(exercise: Exercise): FormGroup {
    return this.fb.group({
      exercise: exercise.name,
      targetRepsPerSet: exercise.targetRepsPerSet,
      targetSets: exercise.targetSets,
      pending: exercise.pending,
      complete: exercise.complete,
      stepInformationFormArray: this.fb.array(this.initStepInformation(exercise.targetSets))
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
    this.stepsFormArray.at(index).get('complete')?.setValue(true);
    if (this.stepsFormArray.at(index+1)){
      this.stepsFormArray.at(index+1).get('pending')?.setValue(true);
    }
  }

  private save() {
    const formValues = this.workoutForm.value;
    const exercisesToSave: Exercise[] = formValues.stepsFormArray.map((step: any) => {
      return {
        name: step.exercise,
        targetRepsPerSet: step.targetRepsPerSet,
        targetSets: step.targetSets,
        completedSets: step.stepInformationFormArray.map((set: any) => ({
          reps: set.repsCompleted,
          intensity: set.intensity
        })),
        pending: step.pending,
        complete: step.complete
      };
    });

    this.storeService.updateExercises(exercisesToSave);
  }


  back(){
    this.navigateService.navigateTo(ViewEnum.Build);
  }

  finish(){
    this.save();
    this.navigateService.navigateTo(ViewEnum.Finish);
  }
}
