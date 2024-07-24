import { AddExercisesComponent } from '../add-exercises/add-exercises.component';
import { NavigateService } from '../common/navigate.service';
import { ViewEnum } from './../common/view.enum';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';
import { StoreService } from '../common/store.service';
import { Observable, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-build',
  standalone: true,
  imports: [AddExercisesComponent, CommonModule, ButtonStandardComponent],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css'
})
export class BuildComponent {

  ViewEnum = ViewEnum;
  @ViewChild(AddExercisesComponent)
  addExercisesComponent: AddExercisesComponent | undefined;
  isAtLeastOneExerciseAdded$: Observable<boolean>;
  private unsubscribe$ = new Subject<void>();

  constructor(private navigateService: NavigateService, private storeService: StoreService) {}

  ngOnInit(){
    this.isAtLeastOneExerciseAdded$ = this.storeService.isAtLeastOneExerciseAdded$;
  }

  navigateToWorkout() {
    this.isAtLeastOneExerciseAdded$.pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(isAtLeastOneExerciseAdded => {
      if (!isAtLeastOneExerciseAdded){
        return
      }
      this.navigateService.navigateTo(ViewEnum.Workout);
    });
  }

  showForm(){
    if (this.addExercisesComponent)
      this.addExercisesComponent.toggleShowForm();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
