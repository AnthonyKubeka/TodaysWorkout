import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, startWith } from 'rxjs';
import { Exercise } from './exercise';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]); //private to Store and has 'memory'
  exercises$ = this.exercisesSubject.asObservable();

  constructor() {
  }

  init() {
    //this would be done in subscription of observable network request

    this.exercisesSubject.next([
      { id: 1, name: 'Pushups', sets: 3, reps: 15 },
      { id: 2, name: 'Squats', sets: 3, reps: 10 },
      { id: 3, name: 'Situps', sets: 3, reps: 20 },
    ]);
  }

  getStaticExercises(): Observable<Exercise[]> {
    return this.exercises$;
  }
}
