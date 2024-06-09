import { Component } from '@angular/core';
import { ButtonStandardComponent } from '../button-standard/button-standard.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-sleek',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button-sleek.component.html',
  styleUrl: './button-sleek.component.css'
})
export class ButtonSleekComponent extends ButtonStandardComponent{

}
