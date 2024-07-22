import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Exercise } from './exercise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { generateGuid } from './utils';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private staticExercisesNamesSubject = new BehaviorSubject<string[]>([]); //private to Store and has 'memory'
  private exercisesSubject = new BehaviorSubject<Exercise[]>([]);
  private exercises$ = this.exercisesSubject.asObservable();
  isAtLeastOneExerciseAdded = false;
  readonly defaultNumberOfSetsOrReps = 1;

  constructor(private httpClient: HttpClient) {
  }

  init() {
    const staticExercisesReq$ = this.getStaticExerciseNames();

    staticExercisesReq$.subscribe({
      next: (exerciseNames: string[]) => {
        this.staticExercisesNamesSubject.next(exerciseNames);
      },
      error: (error) => {
        console.error('Could not fetch static data due to error:', error);
      }
    }
    );
  }

   getStaticExerciseNames(): Observable<string[]> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');

    return this.httpClient.get<string[]>(
      'https://todaysworkoutapi.azurewebsites.net/Exercises/exercise-data',
      { headers: headers }
    ).pipe(
      map((res: any[]) => res.map(item => item.name))
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

    let exercises = this.getExercises();
    exercises.push(newExercise);
    this.exercisesSubject.next(exercises);
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

  updateExercises(exercises: Exercise[]){
    this.exercisesSubject.next(exercises);
  }

  getExerciseByUuid(uuid: string): Exercise | undefined {
    return this.getExercises().find(exercise => exercise.uuid === uuid);
  }

  updateExercise(uuid: string, updatedExercise: Partial<Exercise>) {
    const exercise = this.getExerciseByUuid(uuid);

    if (exercise){
      Object.assign(exercise, updatedExercise);
    }
  }

  getExerciseNames(): string[] {
    return this.staticExercisesNamesSubject.getValue();
  }

  getExercisesObservable(): Observable<Exercise[]> {
    return this.exercises$;
  }

  getExercises(): Exercise[] {
    return this.exercisesSubject.getValue();
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
