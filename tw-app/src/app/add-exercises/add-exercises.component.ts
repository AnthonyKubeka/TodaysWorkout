import { Exercise } from './../common/exercise';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreService } from '../common/store.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BehaviorSubject, Observable, Subject, Subscription, take, takeUntil } from 'rxjs';
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

  showForm: boolean = false;
  addExercisesForm: FormGroup;
  exercises$: Observable<Exercise[]>;
  staticExerciseNames$: Observable<string[]>;

  private unsubscribe$ = new Subject<void>();

  constructor(private fb: FormBuilder, private storeService: StoreService){
    this.addExercisesForm = this.fb.group({
      selectorsFormArray: this.fb.array([])
    });
  }

  ngOnInit() {
    this.exercises$ = this.storeService.getExercises$;
    this.staticExerciseNames$ = this.storeService.getStaticExerciseNames$;
    this.storeService.loadStaticExerciseNames();
    this.storeService.getExercises$.pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(exercises => {
      this.initFormValues(exercises);
    })

    this.addExerciseOption = this.addExerciseOption.bind(this);
  }

  initFormValues(exercises: Exercise[]) {
    const exerciseFGs = exercises.map(exercise => this.createExerciseFormGroup(exercise));
    this.addExercisesForm.setControl('selectorsFormArray', this.fb.array(exerciseFGs));
  }

  createExerciseFormGroup(exercise: Exercise): FormGroup {
    return this.fb.group({
      exerciseOption: [exercise],
      uuid: exercise.uuid
    });
  }

  get selectorsFormArray(){
    return this.addExercisesForm.controls["selectorsFormArray"] as FormArray;
  }

  addExerciseOption = (exerciseName: string) => {
    this.storeService.addStaticExercise(exerciseName);

    const newExercise: Exercise = {
      uuid: generateGuid(),
      name: exerciseName,
      targetSets: 1,
      targetRepsPerSet: 1,
      completedSets: [],
      pending: false,
      complete: false
    };

    this.storeService.addExercise(newExercise);
    return newExercise;
  }

  deleteExercise(index: number){
    this.selectorsFormArray.removeAt(index);
  }

  toggleShowForm() {
    this.showForm = !this.showForm;
  }

  addExerciseSelector() {
    this.selectorsFormArray.push(this.createExerciseFormGroup({
      uuid: generateGuid(),
      name: '',
      targetSets: 1,
      targetRepsPerSet: 1,
      completedSets: [],
      pending: false,
      complete: false
    }));
  }


  save() {
    const formValues = this.addExercisesForm.value;
    const exercises: Exercise[] = formValues.selectorsFormArray.map((selector: any) => ({
      uuid: selector.uuid,
      name: selector.exerciseOption,
      targetSets: 1,
      //targetSets: selector.targetSets,
      targetRepsPerSet: 1,
      //targetRepsPerSet: selector.targetRepsPerSet,
      completedSets: [], // You might want to preserve existing completedSets for existing exercises
      pending: false,
      complete: false
    }));

    exercises.forEach(exercise => {
      if (this.storeService.exerciseExists(exercise.uuid)) {
        this.storeService.updateExercise(exercise);
      } else {
        this.storeService.addExercise(exercise);
      }
    });

    this.toggleShowForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
