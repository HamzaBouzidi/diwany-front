import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-my-button',
  standalone: true,
  imports: [],
  templateUrl: './my-button.component.html',
  styleUrls: ['./my-button.component.css']
})
export class MyButtonComponent {
  @Input() buttonType: 'submit' | 'button' | 'reset' = 'button';  // Default type is 'button'
  @Input() buttonClass: string = 'blue-button'; // Default class
  @Input() text: string = 'Click Me';  // Default text
  @Output() clicked = new EventEmitter<Event>();

  onClick(event: Event): void {
    this.clicked.emit(event);
  }
}
