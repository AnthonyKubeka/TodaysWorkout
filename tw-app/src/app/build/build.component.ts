import { StoreService } from './../common/store.service';
import { AddExercisesComponent } from '../add-exercises/add-exercises.component';
import { NavigateService } from '../common/navigate.service';
import { ViewEnum } from './../common/view.enum';
import { Component, ViewChild } from '@angular/core';
import { Exercise } from '../common/exercise';
import { Observable, startWith } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-build',
  standalone: true,
  imports: [AddExercisesComponent, CommonModule],
  templateUrl: './build.component.html',
  styleUrl: './build.component.css'
})
export class BuildComponent {

  ViewEnum = ViewEnum;
  @ViewChild(AddExercisesComponent)
  addExercisesComponent: AddExercisesComponent | undefined;
  staticExercises$: Observable<Exercise[]>;
  constructor(private navigateService: NavigateService, private storeService: StoreService) {
    this.staticExercises$ = storeService.getStaticExercises();
  }

  ngOnInit(): void {

  }

  navigate(view: ViewEnum) {
    this.navigateService.navigateTo(view);
  }

  showForm(){
    if (this.addExercisesComponent)
      this.addExercisesComponent.toggleShowForm();
  }
}
