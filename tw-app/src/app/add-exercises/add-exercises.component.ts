import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  selectors: number[] = [1];
  showForm: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
  }

  toggleShowForm() {
    this.showForm = !this.showForm;
  }

  addExerciseSelector() {
    this.selectors.push(this.selectors.length + 1);
    }
}
