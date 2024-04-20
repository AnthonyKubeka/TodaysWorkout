import { AddExercisesComponent } from '../add-exercises/add-exercises.component';
import { NavigateService } from '../common/navigate.service';
import { ViewEnum } from './../common/view.enum';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';
import { StoreService } from '../common/store.service';
import { take } from 'rxjs';

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
  constructor(private navigateService: NavigateService, private storeService: StoreService) {}

  get isAtLeastOneExerciseAdded(): boolean {
    return this.storeService.isAtLeastOneExerciseAdded;
  }

  navigateToWorkout(disabled: boolean) {
    if (disabled){
      return;
    }

    this.navigateService.navigateTo(ViewEnum.Workout);
  }

  showForm(){
    if (this.addExercisesComponent)
      this.addExercisesComponent.toggleShowForm();
  }
}
