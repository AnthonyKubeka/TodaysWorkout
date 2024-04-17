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
    this.exercises$ = this.storeService.getExercises();
  }

  back(){
    this.navigateService.navigateTo(ViewEnum.Workout);
  }

  exportToCsv() {
    this.exercises$.pipe(
      take(1),
      map(exercises => {
        const headers = 'Exercise,Set,Reps Completed,Intensity\n';
        const rows = exercises.map(exercise =>
          exercise.completedSets.map((set, index) =>
            `${index === 0 ? exercise.name : ''},${index + 1},${set.reps},${set.intensity}`
          ).join('\n')
        ).join('\n');

        return headers + rows;
      })
    ).subscribe(csvData => {
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'workout-summary.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

}
