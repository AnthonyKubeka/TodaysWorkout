import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ionTrashBin } from '@ng-icons/ionicons';

@Component({
  selector: 'app-button-delete',
  standalone: true,
  imports: [NgIconComponent],
  providers: [provideIcons({ ionTrashBin })],
  templateUrl: './button-delete.component.html',
  styleUrl: './button-delete.component.css'
})
export class ButtonDeleteComponent {

}
