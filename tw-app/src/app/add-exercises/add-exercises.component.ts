import { Exercise } from './../common/exercise';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreService } from '../common/store.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable, Subscription, take } from 'rxjs';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';
import { ButtonDeleteComponent } from '../common/button-delete/button-delete.component';
@Component({
  selector: 'app-add-exercises',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgSelectModule, ButtonStandardComponent, ButtonDeleteComponent],
  templateUrl: './add-exercises.component.html',
  styleUrl: './add-exercises.component.css'
})
export class AddExercisesComponent {

  staticExercises$: Observable<Exercise[]>;
  staticExercises: Exercise[] = [];
  exercises: Exercise[] = [];
  showForm: boolean = false;
  staticExerciseSubscription: Subscription;
  exercisesSubscription: Subscription;
  addExercisesForm!: FormGroup;

  constructor(private fb: FormBuilder, private storeService: StoreService){}

  ngOnInit() {
    this.addExerciseOption = this.addExerciseOption.bind(this);

    this.staticExerciseSubscription = this.storeService.getStaticExercises().subscribe(staticExercises => {
      this.staticExercises = staticExercises;
    });

    this.exercisesSubscription = this.storeService.getExercises().subscribe(exercises => {
         this.exercises = exercises;
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
      setsInput: [exercise.targetSets, Validators.min(1)],
      repsInput: [exercise.targetRepsPerSet, Validators.min(1)],
      stepInformationFormArray: this.fb.array(this.initStepInformation(exercise)) // not explicitly used to show info to user on this screen, more to keep state
    });
  }

  initStepInformation(exercise: Exercise): FormGroup[] {
    return Array.from({length: exercise.targetSets}).map((element, index) => {
      const set = exercise.completedSets && exercise.completedSets[index];
      return this.fb.group({
        repsCompleted: [set ? set.reps : null],
        intensity: [set ? set.intensity : null]
      })
    });
  }

  createSelectorFormControl() {
    return this.fb.group({
      exerciseOption: [this.staticExercises[0]],
      setsInput: [''],
      repsInput: [''],
      stepInformationFormArray: this.fb.array(this.initStepInformation(this.staticExercises[0]))
    });
  }

  get selectorsFormArray(){
    return this.addExercisesForm.controls["selectorsFormArray"] as FormArray;
  }

  addExerciseOption(exercise: string) {
    this.storeService.updateStaticExerciseData(exercise).pipe(take(1)).subscribe(res => {

    const newExercise: Exercise = {
      id: 0,
      name: exercise,
      targetSets: 1,
      targetRepsPerSet: 1,
      completedSets: [{reps: null, intensity: null}]
    };

    this.staticExercises = [...this.staticExercises, newExercise];
    this.storeService.updateExercises(this.staticExercises);
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
    const exercisesToSave: Exercise[] = formValues.selectorsFormArray.map((selector: any) => {
      return {
        id: selector.exerciseOption.id ? selector.exerciseOption.id : 0,
        name: selector.exerciseOption.name,
        targetSets: selector.setsInput,
        targetRepsPerSet: selector.repsInput,
        completedSets: selector.stepInformationFormArray.map((set: any) => ({
          reps: set.repsCompleted,
          intensity: set.intensity
        })),
      };
    });

    this.storeService.updateExercises(exercisesToSave);
    this.toggleShowForm();
  }

  ngOnDestroy() {
    this.staticExerciseSubscription.unsubscribe();
    this.exercisesSubscription.unsubscribe();
  }
}
