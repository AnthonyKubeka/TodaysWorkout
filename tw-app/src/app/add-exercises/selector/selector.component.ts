import { Exercise } from './../../common/exercise';
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectorComponent,
      multi: true
    }
  ]
})

export class SelectorComponent implements ControlValueAccessor{
  @Input() exercises: Exercise[] = [];
  private selectedExercise: Exercise | null;
  exerciseOption = new FormControl({value: this.exercises[0], disabled: false});
  touched: boolean = false;
  disabled: boolean = false;

  constructor() {this.selectedExercise = this.exercises[0];}

  ngOnInit(): void {
    if (!this.selectedExercise) {
      this.selectedExercise = this.exercises[0];
      this.exerciseOption.setValue(this.selectedExercise);
    }

    this.exerciseOption.valueChanges.subscribe((selectedExercise) => {
      this.selectedExercise = selectedExercise;
      this.onChange(selectedExercise);
      this.markAsTouched();
    });

  }

  writeValue(selectedExercise: Exercise): void {
    this.selectedExercise = selectedExercise; // this is the value that will be displayed in the control -> allows the parent form to update this control
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  registerOnChange(onChange: any): void {
    this.onChange = onChange; // this is the function that will be called when the value of the control changes -> to communicate with the parent form
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched(){
    if(!this.touched){
      this.touched = true;
      this.onTouched();
    }
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
