import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-health-assurance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './health-assurance.component.html',
  styleUrl: './health-assurance.component.css'
})
export class HealthAssuranceComponent {
  // Form fields
  fullName: string = '';
  fatherName: string = '';
  grandFatherName: string = '';
  lastName: string = '';
  employeeId: string = '';
  fatherId: string = '';
  phoneNumber: string = '';
  department: string = '';
  familyNames: string = '';

  onSubmit(insuranceForm: NgForm) {
    if (insuranceForm.valid) {
      console.log('Form Submitted', {
        fullName: this.fullName,
        fatherName: this.fatherName,
        grandFatherName: this.grandFatherName,
        lastName: this.lastName,
        employeeId: this.employeeId,
        fatherId: this.fatherId,
        phoneNumber: this.phoneNumber,
        department: this.department,
        familyNames: this.familyNames
      });

      // Reset the form after submission
      insuranceForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }
}
