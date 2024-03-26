import { NavigateService } from './../app/common/navigate.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { ViewEnum } from '../app/common/view.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  ViewEnum = ViewEnum;
  @Output() start = new EventEmitter<void>();

  constructor(private navigateService: NavigateService) { }

navigate(view: ViewEnum) {
  this.navigateService.navigateTo(view);
}

}
