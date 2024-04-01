import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, startWith } from 'rxjs';
import { Exercise } from './exercise';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private staticExercisesSubject = new BehaviorSubject<Exercise[]>([]); //private to Store and has 'memory'
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  staticExercises$ = this.staticExercisesSubject.asObservable();
  exercises$ = this.exercisesSubject.asObservable();

  constructor() {
  }

  init() {
    //this would be done in subscription of observable network request

    this.staticExercisesSubject.next([
      { id: 1, name: 'Pushups', sets: 3, reps: 15 },
      { id: 2, name: 'Squats', sets: 3, reps: 10 },
      { id: 3, name: 'Situps', sets: 3, reps: 20 },
    ]);
  }

  saveExerciseSession(exercises: Exercise[]) {
    this.exercisesSubject.next(exercises);
  }

  getStaticExercises(): Observable<Exercise[]> {
    return this.staticExercises$;
  }

  getExercises(): Observable<Exercise[]> {
    return this.exercises$;
  }
}
