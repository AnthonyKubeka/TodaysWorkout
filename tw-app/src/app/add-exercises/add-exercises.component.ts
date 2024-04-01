import { Exercise } from './../common/exercise';
import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreService } from '../common/store.service';

@Component({
  selector: 'app-add-exercises',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-exercises.component.html',
  styleUrl: './add-exercises.component.css'
})
export class AddExercisesComponent {

  @Input() staticExercises: Exercise[] = [];
  showForm: boolean = false;

  addExercisesForm!: FormGroup;

  constructor(private fb: FormBuilder, private storeService: StoreService){
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

  ngOnChanges(changes: SimpleChanges): void {
  }

  get selectorsFormArray(){
    return this.addExercisesForm.controls["selectorsFormArray"] as FormArray;
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
        id: selector.exerciseOption.id,
        name: selector.exerciseOption.name,
        sets: selector.setsInput,
        reps: selector.repsInput
      };
    });

    this.storeService.updateExercises(exercisesToSave);
    this.toggleShowForm();
  }
}
