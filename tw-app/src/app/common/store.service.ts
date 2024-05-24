import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Exercise } from './exercise';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private staticExercisesSubject = new BehaviorSubject<Exercise[]>([]); //private to Store and has 'memory'
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  private staticExercises$ = this.staticExercisesSubject.asObservable();
  private exercises$ = this.exercisesSubject.asObservable();
  isAtLeastOneExerciseAdded = false;
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

  updateStaticExerciseData(exerciseName: string): Observable<any> {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    headers = headers.append('Accept', 'application/json');

    const url = `https://todaysworkoutapi.azurewebsites.net/Exercises/add-exercise-data?exerciseName=${encodeURIComponent(exerciseName)}`;

    return this.httpClient.post(url, null, { headers: headers })
    .pipe(
      catchError(err => {
        console.log('Error updating exercise data: ', err)
        return of(null);
      })
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
    if(exercises.length > 0){
      this.isAtLeastOneExerciseAdded = true;
    }

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
        targetSets: 2,
        targetRepsPerSet: 10,
        completedSets: [{reps: 1, intensity: 9, weight: 1}, {reps: 1, intensity: 9, weight: 2} ],
        pending: false,
        complete: false
      },
      {
        id: 2,
        name: 'Pull Ups',
        targetSets: 3,
        targetRepsPerSet: 8,
        completedSets: [{reps: 1, intensity: 9, weight: 10}, {reps: 1, intensity: 9, weight: 10}, {reps: 1, intensity: 9, weight: 8}],
        pending: false,
        complete: false
      },
      {
        id: 3,
        name: 'Squats',
        targetSets: 1,
        targetRepsPerSet: 12,
        completedSets: [{reps: 1, intensity: 9, weight: null}],
        pending: false,
        complete: false
      }
    ];

    return of(exercises);
  }
}
