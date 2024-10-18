import { NavigateService } from '../common/navigate.service';
import { Exercise } from '../common/exercise';
import { Observable, Subscription, map, of, take } from 'rxjs';
import { StoreService } from '../common/store.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEnum } from '../common/view.enum';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';
import { ButtonSleekComponent } from '../common/button-sleek/button-sleek.component';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';
@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [CommonModule, ButtonStandardComponent, ButtonSleekComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent {
  exercises$: Observable<Exercise[]> = of([]);
  exerciseForm: FormGroup;
  constructor(private storeService: StoreService, private navigateService: NavigateService, private fb: FormBuilder){}

  ngOnInit() {
    this.exercises$ = this.storeService.getExercisesFake();
    this.exercises$.subscribe(exercises => {
      if (exercises){
        this.initForm(exercises)
        console.log('Exercises: ', exercises);
      }
    })
  }

  get exercisesFormArray(): FormArray {
    return this.exerciseForm.controls["exercisesFormArray"] as FormArray;
  }

  getSetsFormArray(index: number): FormArray {
    return this.exercisesFormArray.at(index).get('setsFormArray') as FormArray;
  }

  back(){
    this.navigateService.navigateTo(ViewEnum.Workout);
  }

  addSet(index: number) {
    const setsFormArray = this.getSetsFormArray(index);
    setsFormArray.push(this.createBlankExerciseSetFormGroup())
    }

  addExercise() {
    this.exercisesFormArray.push(this.createBlankExerciseFormGroup())
    }

  initForm(exercises: Exercise[]){
    let exerciseFormGroups = exercises.map(exercise => this.createExerciseFormGroup(exercise));
    this.exerciseForm = this.fb.group({
      exercisesFormArray: this.fb.array(exerciseFormGroups)
    })
  }

  createExerciseFormGroup(exercise: Exercise): FormGroup {
    return this.fb.group({
      name: exercise.name,
      targetRepsPerSet: exercise.targetRepsPerSet,
      sets: exercise.targetSets,
      completedSets: exercise.completedSets,
      setsFormArray: this.fb.array(this.createExerciseSetsFormGroup(exercise))
    })
  }

  createExerciseSetsFormGroup(exercise: Exercise): FormGroup[] {
    return Array.from({ length: exercise.targetSets }).map((_, index) => {
      const set = exercise.completedSets && exercise.completedSets[index];
      return this.fb.group({
        repsCompleted: [set ? set.reps : null],
        intensity: [set ? set.intensity : null],
        weight: [set ? set.weight: null]
      });
    });
  }

  createBlankExerciseSetFormGroup(): FormGroup {
      return this.fb.group({
        repsCompleted: [],
        intensity: [],
        weight: []
      });
  }

  createBlankExerciseFormGroup(): FormGroup {
    let formGroup = this.fb.group({
      name: [],
      targetRepsPerSet: 1,
      sets: 1,
      completedSets: 1,
      setsFormArray: this.fb.array([this.createBlankExerciseSetFormGroup()])
    });

    return formGroup;
  }

  getExerciseString(exercise: Exercise): string {
    let heading = '';
    let rows = '';
    heading = `Exercise: ${exercise.name}`;
    exercise.completedSets.map((set, index) =>{
      rows = rows + '\n' + `Set${index+1}Reps: ${set.reps}, Intensity: ${set.intensity}`;
    }
  );
    return heading + rows + '\n';
  }

  copyToClipboard(){
    this.mapExercisesToSummary().subscribe(csvData => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(csvData)
          .then(() => {
            console.log('CSV data copied to clipboard successfully!');
          })
          .catch(err => {
            console.error('Failed to copy CSV data to clipboard: ', err);
          });
      } else {
        console.log('Clipboard API not available.');
      }
    });
  }

  exportToCsv() {
    this.mapExercisesToSummary().subscribe(csvData => {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workout-summary.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  private mapExercisesToSummary(): Observable<string>{
    return this.exercises$.pipe(
      take(1),
      map(exercises => {
        let exercisesArr: string[] = [];
        exercises.map(exercise => {
          let exerciseString = this.getExerciseString(exercise);
          exercisesArr.push(exerciseString);
        })
        return exercisesArr.join('\n');
      })
    );
  }

}
