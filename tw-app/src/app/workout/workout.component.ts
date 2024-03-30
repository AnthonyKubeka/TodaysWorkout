import { Component, Input } from '@angular/core';
import { Exercise } from '../common/exercise';

@Component({
  selector: 'app-workout',
  standalone: true,
  imports: [],
  templateUrl: './workout.component.html',
  styleUrl: './workout.component.css'
})
export class WorkoutComponent {
  exercises: Exercise[] = [];

  constructor(){}
}
