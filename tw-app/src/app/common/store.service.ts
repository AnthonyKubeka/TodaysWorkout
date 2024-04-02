import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
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
        sets: 3,
        reps: 10,
        pending: false,
        complete: false
      })))
    );
  }

  updateExercises(exercises: Exercise[]) {
    this.exercisesSubject.next(exercises);
  }

  getStaticExercises(): Observable<Exercise[]> {
    return this.staticExercises$;
  }

  getExercises(): Observable<Exercise[]> {
    return this.exercises$;
  }
}
