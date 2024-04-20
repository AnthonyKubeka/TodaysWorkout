import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionInformationCircleOutline } from '@ng-icons/ionicons';
import { Subscription } from 'rxjs';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';
import { Exercise } from '../common/exercise';
import { NavigateService } from '../common/navigate.service';
import { StoreService } from '../common/store.service';
import { ViewEnum } from '../common/view.enum';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonStandardComponent, NgIconComponent],
  providers: [provideIcons({ionInformationCircleOutline})],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent {
  workoutForm!: FormGroup;
  exercisesSubscription: Subscription;
  constructor(private storeService: StoreService, private fb: FormBuilder, private navigateService: NavigateService){}

  ngOnInit() {

    this.exercisesSubscription = this.storeService.getExercises().subscribe(exercises => {
      if (exercises){
        this.initFormValues(exercises);
      }
   });

  }

  get stepsFormArray(){
    return this.workoutForm.controls["stepsFormArray"] as FormArray;
  }

  initFormValues(exercises: Exercise[]){
    if (!exercises[0]?.complete){
      exercises[0].pending = true;
    }

    const stepFormGroups = exercises.map(exercise => this.createStepFormGroup(exercise));
    const stepsFormArray = this.fb.array(stepFormGroups);
    this.workoutForm = this.fb.group({
      stepsFormArray: stepsFormArray
    });
  }

  createStepFormGroup(exercise: Exercise): FormGroup {
    return this.fb.group({
      exercise: exercise.name,
      targetRepsPerSet: exercise.targetRepsPerSet,
      targetSets: exercise.targetSets,
      pending: exercise.pending,
      complete: exercise.complete,
      stepInformationFormArray: this.fb.array(this.initStepInformation(exercise))
    })
  }

  initStepInformation(exercise: Exercise): FormGroup[] {
    return Array.from({ length: exercise.targetSets }).map((element, index) => {
      const set = exercise.completedSets && exercise.completedSets[index];  // Check both for the array and the specific index
      return this.fb.group({
        repsCompleted: [set ? set.reps : null],
        intensity: [set ? set.intensity : null]  // Use the value if set exists, otherwise null
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

  ngOnDestroy() {
    this.exercisesSubscription.unsubscribe();
  }
}
