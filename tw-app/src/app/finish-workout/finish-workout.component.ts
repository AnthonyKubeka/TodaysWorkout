import { NavigateService } from './../common/navigate.service';
import { Exercise } from './../common/exercise';
import { Observable, Subscription, map, of, take } from 'rxjs';
import { StoreService } from './../common/store.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewEnum } from '../common/view.enum';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';

@Component({
  selector: 'app-finish-workout',
  standalone: true,
  imports: [CommonModule, ButtonStandardComponent],
  templateUrl: './finish-workout.component.html',
  styleUrl: './finish-workout.component.css'
})
export class FinishWorkoutComponent {

  exercises$: Observable<Exercise[]> = of([]);
  constructor(private storeService: StoreService, private navigateService: NavigateService){}

  ngOnInit() {
    this.exercises$ = this.storeService.getExercisesObservable();
  }

  back(){
    this.navigateService.navigateTo(ViewEnum.Workout);
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
