import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-acknowledgment-pledge',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './acknowledgment-pledge.component.html',
  styleUrl: './acknowledgment-pledge.component.css'
})
export class AcknowledgmentPledgeComponent {

  // Form fields
  name: string = '';
  nationalNumber: string = '';
  qualification: string = '';

  // Method to handle form submission
  onSubmit(commitmentForm: NgForm) {
    if (commitmentForm.valid) {
      console.log('Form Submitted', {
        name: this.name,
        nationalNumber: this.nationalNumber,
        qualification: this.qualification
      });
      // Reset form after submission
      commitmentForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }
}