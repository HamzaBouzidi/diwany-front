import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CinService } from '../../services/cin/cin.service';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-national-identity-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DoneModalComponent],
  templateUrl: './national-identity-card.component.html',
  styleUrls: ['./national-identity-card.component.css']
})
export class NationalIdentityCardComponent implements OnInit {
  fullName: string = '';
  personalId: string = '';
  nationalNumber: string = '';
  position: string = '';
  refEmp: string | undefined; // Reference to employee from token
  employeeName: string = '';
  isModalVisible: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private userService: UserInfoService,
    private tokenService: TokenService,
    private cinService: CinService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken();
  }

  // Fetch user reference from token and load user info
  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.refEmp = decodedToken.ref_emp;
      this.getUserInfo(); // Load additional user info
    } else {
      console.error('Error decoding token or token missing');
    }
  }

  getUserInfo(): void {
    if (this.refEmp) {
      this.userService.getUserInfo(this.refEmp).subscribe(
        (response) => {
          this.employeeName = response.nm || ''; // Fallback to empty string
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  // Submit form to create CIN request
  onSubmit(identityForm: NgForm): void {
    if (identityForm.valid) {
      const formData = {
        user_name: this.fullName,
        user_num: this.personalId,
        user_natio_num: this.nationalNumber,
        user_sifa: this.position,
        user_ref_emp: this.refEmp
      };

      this.isLoading = true;
      this.cinService.submitCinRequest(formData).subscribe(
        (response) => {
          console.log('Form submitted successfully:', response);
          this.isModalVisible = true;
          setTimeout(() => {
            this.closeModal();
            this.router.navigate(['/dashboard/definitions-autorisations']);
          }, 3000);
        },
        (error) => {
          console.error('Error submitting the form:', error);
          this.errorMessage = 'Error submitting the form. Please try again later.';
        }
      );
      identityForm.reset();
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
