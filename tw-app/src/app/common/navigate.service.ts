import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ViewEnum } from './view.enum';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {
  private navigationState = new BehaviorSubject<ViewEnum>(ViewEnum.Home);

  currentView$ = this.navigationState.asObservable();
  constructor() { }

  navigateTo(view: ViewEnum) {
    this.navigationState.next(view);
  }
}
