import { Exercise } from './../common/exercise';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreService } from '../common/store.service';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-add-exercises',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './add-exercises.component.html',
  styleUrl: './add-exercises.component.css'
})
export class AddExercisesComponent {


  @Input() staticExercises: Exercise[] = [];
  showForm: boolean = false;

  addExercisesForm!: FormGroup;

  constructor(private fb: FormBuilder, private storeService: StoreService){
    this.addExerciseOption = this.addExerciseOption.bind(this);
  }

  ngOnInit() {
    this.addExercisesForm = this.fb.group({
      selectorsFormArray: this.fb.array([this.createSelectorFormControl()])
    });
  }

  createSelectorFormControl() {
    return this.fb.group({
      exerciseOption: [this.staticExercises[0]],
      setsInput: [''],
      repsInput: ['']
    });
  }

  get selectorsFormArray(){
    return this.addExercisesForm.controls["selectorsFormArray"] as FormArray;
  }

  addExerciseOption(exercise: string) {
    this.storeService.updateStaticExerciseData(exercise).subscribe();
    }

  toggleShowForm() {
    this.showForm = !this.showForm;
  }

  addExerciseSelector() {
    this.selectorsFormArray.push(this.createSelectorFormControl());
    }

  save(){
    const formValues = this.addExercisesForm.value;

    if (!formValues){
      return;
    }

    const exercisesToSave: Exercise[] = formValues.selectorsFormArray.map((selector: any) => {
      return {
        id: selector.exerciseOption.id,
        name: selector.exerciseOption.name,
        targetSets: selector.setsInput,
        targetRepsPerSet: selector.repsInput
      };
    });

    this.storeService.updateExercises(exercisesToSave);
    this.toggleShowForm();
  }
}
