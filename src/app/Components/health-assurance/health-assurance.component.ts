import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HealthAssuranceService } from '../../services/health-assurance/health-assurance.service';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health-assurance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './health-assurance.component.html',
  styleUrls: ['./health-assurance.component.css'],
})
export class HealthAssuranceComponent implements OnInit {
  // Form fields
  fullName: string = '';
  fatherName: string = '';
  grandFatherName: string = '';
  lastName: string = '';
  motherName: string = '';
  motherLastName: string = '';
  phoneNumber: string = '';
  department: string = '';
  familyNames: string = '';
  isSubmitting = false;
  submissionError: string | null = null;
  ref_emp: string | undefined; // Employee reference from the token

  // File fields
  birthCertificate: File | null = null;
  familyStateCertificate: File | null = null;

  constructor(
    private healthAssuranceService: HealthAssuranceService,
    private userService: UserInfoService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken(); // Populate `ref_emp` and `fullName`
  }

  // Fetch user information using userRefEmp
  getUserInfo(): void {
    if (this.ref_emp) {
      this.userService.getUserInfo(this.ref_emp).subscribe(
        (response) => {
          this.fullName = response.nm || ''; // Use "nm" from API for اسم الموظف
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  // Extract `ref_emp` from token and fetch user info
  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.ref_emp = decodedToken.ref_emp || ''; // Get user_ref_emp from the decoded token
      this.getUserInfo(); // Fetch user info using ref_emp
    } else {
      console.error('Error decoding token or token is missing');
    }
  }

  // Handle file selection
  onFileSelect(event: Event, fileType: 'birthCertificate' | 'familyStateCertificate'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (fileType === 'birthCertificate') {
        this.birthCertificate = file;
      } else if (fileType === 'familyStateCertificate') {
        this.familyStateCertificate = file;
      }
    }
  }

  onSubmit(insuranceForm: NgForm): void {
    if (insuranceForm.valid) {
      const formData = new FormData();
      formData.append('name', this.fullName);
      formData.append('father_name', this.fatherName);
      formData.append('grandfather_name', this.grandFatherName);
      formData.append('family_last_name', this.lastName);
      formData.append('mother_name', this.motherName);
      formData.append('mother_last_name', this.motherLastName);
      formData.append('phone_number', this.phoneNumber);
      formData.append('administration', this.department);
      formData.append('employee_rw', this.ref_emp || '');
      formData.append('family_members_list', JSON.stringify(this.familyNames.split('\n')));

      if (this.birthCertificate) {
        formData.append('birth_certificate', this.birthCertificate);
      }
      if (this.familyStateCertificate) {
        formData.append('family_state_certificate', this.familyStateCertificate);
      }

      this.isSubmitting = true;
      this.submissionError = null;

      this.healthAssuranceService.createHealthAssurance(formData).subscribe(
        (response) => {
          console.log('Health assurance request created successfully:', response);
          this.isSubmitting = false;
          insuranceForm.reset(); // Reset the form
          this.birthCertificate = null;
          this.familyStateCertificate = null;
        },
        (error) => {
          console.error('Error creating health assurance request:', error);
          this.isSubmitting = false;
          this.submissionError = 'Failed to submit the request. Please try again.';
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
