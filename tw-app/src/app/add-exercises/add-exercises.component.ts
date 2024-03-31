import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Exercise } from '../common/exercise';
import { SelectorComponent } from './selector/selector.component';

@Component({
  selector: 'app-add-exercises',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SelectorComponent],
  templateUrl: './add-exercises.component.html',
  styleUrl: './add-exercises.component.css'
})
export class AddExercisesComponent {

  @Input() staticExercises: Exercise[] = [];
  showForm: boolean = false;

  selectorsFormArray = new FormArray([
   this.createSelectorFormControl()
  ]);

  addExercisesForm: FormGroup = new FormGroup({
    selectorsFormGroup: this.selectorsFormArray
  })

  constructor(){
  }

  createSelectorFormControl() {
    return new FormControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  toggleShowForm() {
    this.showForm = !this.showForm;
  }

  addExerciseSelector() {
    this.selectorsFormArray.push(this.createSelectorFormControl());
    }
}
