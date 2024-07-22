import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeComponent } from './home/home.component';
import { NavigateService } from './common/navigate.service';
import { ViewEnum } from './common/view.enum';
import { BuildComponent } from './build/build.component';
import { StoreService } from './common/store.service';
import { WorkoutComponent } from './workout/workout.component';
import { FinishWorkoutComponent } from './finish-workout/finish-workout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, CommonModule, BuildComponent, WorkoutComponent, FinishWorkoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'tw-app';
  ViewEnum = ViewEnum;
  currentView$: Observable<ViewEnum>;
  constructor(private navigateService: NavigateService, private storeService: StoreService) {
    this.currentView$ = this.navigateService.currentView$;
   }

  ngOnInit(): void {
    this.storeService.init();
  }
}



