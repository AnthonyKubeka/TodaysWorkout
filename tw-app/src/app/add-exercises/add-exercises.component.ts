import { Exercise } from './../common/exercise';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreService } from '../common/store.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, Subscription, take } from 'rxjs';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';
import { ButtonDeleteComponent } from '../common/button-delete/button-delete.component';
import { generateGuid } from '../common/utils';

@Component({
  selector: 'app-add-exercises',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgSelectModule, ButtonStandardComponent, ButtonDeleteComponent],
  templateUrl: './add-exercises.component.html',
  styleUrl: './add-exercises.component.css'
})
export class AddExercisesComponent {

  exerciseNames: string[] = [];
  showForm: boolean = false;
  staticExerciseSubscription: Subscription;
  exercisesSubscription: Subscription;
  addExercisesForm!: FormGroup;

  constructor(private fb: FormBuilder, private storeService: StoreService){}

  ngOnInit() {
    this.addExerciseOption = this.addExerciseOption.bind(this);
    this.exerciseNames = this.storeService.getExerciseNames();

    this.exercisesSubscription = this.storeService.getExercisesObservable().subscribe(exercises => {
         this.initFormValues(exercises);
      }
    )

  }

  initFormValues(exercises: Exercise[]){
    const exerciseFGs = exercises.map(exercise => this.createExerciseFormGroup(exercise));
    const exerciseFormArray = this.fb.array(exerciseFGs);
    this.addExercisesForm = this.fb.group({
      selectorsFormArray: exerciseFormArray
    });
  }

  createExerciseFormGroup(exercise: Exercise): FormGroup {
    return this.fb.group({
      exerciseOption: [exercise],
    });
  }

  createSelectorFormControl() {
    const exerciseOption = this.storeService.createExercise(generateGuid(), this.exerciseNames[0]);
    return this.fb.group({
      exerciseOption: [exerciseOption],
    });
  }

  get selectorsFormArray(){
    return this.addExercisesForm.controls["selectorsFormArray"] as FormArray;
  }

  addExerciseOption(exercise: string) {
    this.storeService.updateStaticExerciseData(exercise).pipe(take(1)).subscribe(res => {

    const newExercise: Exercise = {
      uuid: generateGuid(),
      name: exercise,
      targetSets: 1,
      targetRepsPerSet: 1,
      completedSets: [{reps: null, intensity: null, weight: null}]
    };

    this.exerciseNames = [...this.exerciseNames, exercise];
    const exercisesToUpdate = [...this.storeService.getExercises(), newExercise];
    this.storeService.updateExercises(exercisesToUpdate);
    });

  }

  deleteExercise(index: number){
    this.selectorsFormArray.removeAt(index);
  }

  toggleShowForm() {
    this.showForm = !this.showForm;
  }

  addExerciseSelector() {
    this.selectorsFormArray.push(this.createSelectorFormControl());
    }


  save(){
    const formValues = this.addExercisesForm.value;
    const existingExercises = this.storeService.getExercises();

    const exerciseData = formValues.selectorsFormArray.map((selector: any) => {
      return {
        uuid: selector.exerciseOption.uuid,
        name: selector.exerciseOption.name
      };
    });

    exerciseData.forEach(exercise => {
      const existingExercise = existingExercises.find((e) => e.uuid == exercise.uuid);
      if (existingExercise){
        existingExercise.name = exercise.name;
      }else{
        existingExercises.push(this.storeService.createExercise(exercise.uuid, exercise.name));
      }
    })

    this.storeService.updateExercises(existingExercises);
    this.toggleShowForm();
  }

  ngOnDestroy() {
    this.staticExerciseSubscription.unsubscribe();
    this.exercisesSubscription.unsubscribe();
  }
}
