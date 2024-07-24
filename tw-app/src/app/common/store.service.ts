import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap, take } from 'rxjs';
import { Exercise } from './exercise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { generateGuid } from './utils';
import { ExerciseState } from './exercise-state.interface';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private state$ = new BehaviorSubject<ExerciseState>({
    exercises: [],
    staticExerciseNames: []
  });

  getExercises$ = this.state$.pipe(map(state => state.exercises));
  getStaticExerciseNames$ = this.state$.pipe(map(state => state.staticExerciseNames));

  isAtLeastOneExerciseAdded$ = this.state$.pipe(map(state => state.exercises.length > 0));
  readonly defaultNumberOfSetsOrReps = 1;

  constructor(private httpClient: HttpClient) {
  }

  init() {
    this.loadStaticExerciseNames().pipe(
      tap(names => {
        this.state$.next({
          ...this.state$.value,
          staticExerciseNames: names
        })
      })
    ).subscribe({
      next: () => console.log('Static exercise names loaded'),
      error: (error) => console.error('Error loading static exercise names:', error),
      complete: () => console.log('Static exercise names loading completed')
    });
  }

  exerciseExists(uuid: string): boolean {
    const currentState = this.state$.getValue();
    return currentState.exercises.some(exercise => exercise.uuid === uuid);
  }

   loadStaticExerciseNames(): Observable<string[]> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');

    return this.httpClient.get<string[]>(
      'https://todaysworkoutapi.azurewebsites.net/Exercises/exercise-data',
      { headers: headers }
    ).pipe(
      map((res: any[]) => res.map(item => item.name))
    )
  }


  addStaticExercise(exerciseName: string): Observable<any> {
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

  createBlankExercise(name: string) {
    const newExercise: Exercise = {
      uuid: generateGuid(),
      name,
      targetSets: this.defaultNumberOfSetsOrReps,
      targetRepsPerSet: this.defaultNumberOfSetsOrReps,
      completedSets: [],
      pending: false,
      complete: false
    };

    // let exercises = this.getExercises();
    // exercises.push(newExercise);
    // this.state$.next(exercises);
  }

  createExercise(uuid: string, name: string): Exercise {
    return {
      uuid: uuid,
      name,
      targetSets: this.defaultNumberOfSetsOrReps,
      targetRepsPerSet: this.defaultNumberOfSetsOrReps,
      completedSets: [],
      pending: false,
      complete: false
    };
  }

  updateExercise(updatedExercise: Exercise){
    this.state$.pipe(
      take(1),
      tap(state => {
        const updatedExercise = state.exercises.map(ex => ex.uuid === updatedExercise.uuid ? updatedExercise : ex);
        this.state$.next({
          ...state,
          exercises: updatedExercise
        });
      })
    )
  }

  addExercise(exercise: Exercise) {
    this.state$.pipe(
      take(1),
      tap(state => {
        this.state$.next({
          ...state,
          exercises: [...state.exercises, exercise]
        });
      })
    ).subscribe();
  }

  getExercisesFake(): Observable<Exercise[]>{
    const exercises: Exercise[] = [
      {
        uuid: generateGuid(),
        name: 'Pushups',
        targetSets: 2,
        targetRepsPerSet: 10,
        completedSets: [{reps: 1, intensity: 9, weight: 1}, {reps: 1, intensity: 9, weight: 2} ],
        pending: false,
        complete: false
      },
      {
        uuid: generateGuid(),
        name: 'Pull Ups',
        targetSets: 3,
        targetRepsPerSet: 8,
        completedSets: [{reps: 1, intensity: 9, weight: 10}, {reps: 1, intensity: 9, weight: 10}, {reps: 1, intensity: 9, weight: 8}],
        pending: false,
        complete: false
      },
      {
        uuid: generateGuid(),
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
