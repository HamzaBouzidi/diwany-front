import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-done-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './done-modal.component.html',
  styleUrl: './done-modal.component.css'
})
export class DoneModalComponent {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }
}
