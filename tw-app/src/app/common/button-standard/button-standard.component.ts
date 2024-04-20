import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-standard',
  standalone: true,
  imports: [],
  templateUrl: './button-standard.component.html',
  styleUrl: './button-standard.component.css'
})
export class ButtonStandardComponent {
 @Input() text: string;
 @Input() disabled: boolean = false;
}
