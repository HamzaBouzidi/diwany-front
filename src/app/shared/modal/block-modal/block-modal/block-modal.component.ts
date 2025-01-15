import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-block-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './block-modal.component.html',
  styleUrl: './block-modal.component.css'
})
export class BlockModalComponent {

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.isVisible = false;
    this.close.emit();
  }

}
