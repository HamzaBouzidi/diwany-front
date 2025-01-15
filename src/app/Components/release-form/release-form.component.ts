import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ReleaseService } from '../../services/release/release.service';
import { Router } from '@angular/router';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";

@Component({
  selector: 'app-release-form',
  standalone: true,
  imports: [CommonModule, DoneModalComponent, FormsModule],
  templateUrl: './release-form.component.html',
  styleUrls: ['./release-form.component.css']
})
export class ReleaseFormComponent {
  directorName: string = '';
  employeeName: string = '';
  department: string = '';
  reason: string = '';
  isModalVisible: boolean = false;

  // Fields for each row
  R1_direction: string = '';
  R1_name: string = '';
  R1_date: string = '';
  R1_notes: string = '';
  R1_position: string = '';

  R2_direction: string = '';
  R2_name: string = '';
  R2_date: string = '';
  R2_notes: string = '';
  R2_position: string = '';

  R3_direction: string = '';
  R3_name: string = '';
  R3_date: string = '';
  R3_notes: string = '';
  R3_position: string = '';

  R4_direction: string = '';
  R4_name: string = '';
  R4_date: string = '';
  R4_notes: string = '';
  R4_position: string = '';

  R5_direction: string = '';
  R5_name: string = '';
  R5_date: string = '';
  R5_notes: string = '';
  R5_position: string = '';

  R6_direction: string = '';
  R6_name: string = '';
  R6_date: string = '';
  R6_notes: string = '';
  R6_position: string = '';

  constructor(private releaseService: ReleaseService,private router: Router) { }

  // Method to handle form submission
  onSubmit(clearanceForm: NgForm) {
    if (clearanceForm.valid) {
      const formData = {
        directorName: this.directorName,
        employeeName: this.employeeName,
        department: this.department,
        reason: this.reason,

        // Row data
        R1_direction: this.R1_direction, R1_name: this.R1_name, R1_date: this.R1_date, R1_notes: this.R1_notes, R1_position: this.R1_position,
        R2_direction: this.R2_direction, R2_name: this.R2_name, R2_date: this.R2_date, R2_notes: this.R2_notes, R2_position: this.R2_position,
        R3_direction: this.R3_direction, R3_name: this.R3_name, R3_date: this.R3_date, R3_notes: this.R3_notes, R3_position: this.R3_position,
        R4_direction: this.R4_direction, R4_name: this.R4_name, R4_date: this.R4_date, R4_notes: this.R4_notes, R4_position: this.R4_position,
        R5_direction: this.R5_direction, R5_name: this.R5_name, R5_date: this.R5_date, R5_notes: this.R5_notes, R5_position: this.R5_position,
        R6_direction: this.R6_direction, R6_name: this.R6_name, R6_date: this.R6_date, R6_notes: this.R6_notes, R6_position: this.R6_position
      };

      this.releaseService.submitReleaseForm(formData).subscribe(
        (response) => {
          console.log('Release form submitted successfully:', response);
          this.isModalVisible = true;
          clearanceForm.reset();
          setTimeout(() => {
            this.closeModal(); // Close the modal
            this.router.navigate(['/dashboard/definitions-autorisations']);
          }, 3000);
        },
        (error) => {
          console.error('Error submitting release form:', error);
        }
      );
    }
  }
  closeModal() {
    this.isModalVisible = false;
  }
}