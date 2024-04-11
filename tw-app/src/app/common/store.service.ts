import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, tap } from 'rxjs';
import { Exercise } from './exercise';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private staticExercisesSubject = new BehaviorSubject<Exercise[]>([]); //private to Store and has 'memory'
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  staticExercises$ = this.staticExercisesSubject.asObservable();
  exercises$ = this.exercisesSubject.asObservable();
  readonly defaultNumberOfSetsOrReps = 1;

  constructor(private httpClient: HttpClient) {
  }

  init() {
    const staticExercisesReq$ = this.getStaticExerciseData();

    staticExercisesReq$.subscribe({
      next: (exercises: Exercise[]) => {
        this.staticExercisesSubject.next(exercises);
      },
      error: (error) => {
        console.error('Could not fetch static data due to error:', error);
      }
    }
    );
  }

  private getStaticExerciseData(): Observable<Exercise[]> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');

    return this.httpClient.get<Exercise[]>(
      'https://todaysworkoutapi.azurewebsites.net/Exercises/exercise-data',
      { headers: headers }
    ).pipe(
      map((res: any[]) => res.map(item => ({
        ...item,
        targetSets: this.defaultNumberOfSetsOrReps,
        targetRepsPerSet: this.defaultNumberOfSetsOrReps,
        completedSets: [],
        pending: false,
        complete: false
      })))
    );
  }

  updateExercises(exercises: Exercise[]) {
    exercises.forEach(exercise => {
      if (!exercise.targetSets){
        exercise.targetSets = this.defaultNumberOfSetsOrReps;
      }

      if (!exercise.targetRepsPerSet){
        exercise.targetRepsPerSet = this.defaultNumberOfSetsOrReps;
      }
    });
    this.exercisesSubject.next(exercises);
  }

  getStaticExercises(): Observable<Exercise[]> {
    return this.staticExercises$;
  }

  getExercises(): Observable<Exercise[]> {
    return this.exercises$;
  }

  getExercisesFake(): Observable<Exercise[]>{
    const exercises: Exercise[] = [
      {
        id: 1,
        name: 'Pushups',
        targetSets: 3,
        targetRepsPerSet: 10,
        completedSets: [{reps: 1, intensity: 9}, {reps: 1, intensity: 9} ],
        pending: false,
        complete: false
      },
      {
        id: 2,
        name: 'Pull Ups',
        targetSets: 3,
        targetRepsPerSet: 8,
        completedSets: [{reps: 1, intensity: 9}, {reps: 1, intensity: 9}, {reps: 1, intensity: 9}],
        pending: false,
        complete: false
      },
      {
        id: 3,
        name: 'Squats',
        targetSets: 4,
        targetRepsPerSet: 12,
        completedSets: [{reps: 1, intensity: 9}],
        pending: false,
        complete: false
      }
    ];

    return of(exercises);
  }
}
