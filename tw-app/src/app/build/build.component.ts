import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { ButtonStandardComponent } from '../common/button-standard/button-standard.component';
import { NavigateService } from '../common/navigate.service';
import { StoreService } from '../common/store.service';
import { ViewEnum } from './../common/view.enum';

@Component({
  selector: 'app-build',
  standalone: true,
  imports: [CommonModule, ButtonStandardComponent],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css'
})
export class BuildComponent {

  ViewEnum = ViewEnum;
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
}
