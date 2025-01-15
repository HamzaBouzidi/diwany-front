import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CinService } from '../../services/cin/cin.service';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { BlockModalComponent } from "../../shared/modal/block-modal/block-modal/block-modal.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-national-identity-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DoneModalComponent, BlockModalComponent],
  templateUrl: './national-identity-card.component.html',
  styleUrls: ['./national-identity-card.component.css'] 
})
export class NationalIdentityCardComponent {

  fullName: string = '';
  personalId: string = '';
  nationalNumber: string = '';
  position: string = '';
  ref_emp: string | undefined;
  employeeName: string = '';
  isModalVisible: boolean = false;

  constructor(
    private userService: UserInfoService,
    private tokenService: TokenService,
    private cinService: CinService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken();
  }

  // Fetch user information using userRefEmp
  getUserInfo(): void {
    if (this.ref_emp) {
      this.userService.getUserInfo(this.ref_emp).subscribe(
        (response) => {
          this.employeeName = response.nm || ''; // Use "nm" from API for اسم الموظف
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    console.log(decodedToken)

    if (decodedToken) {
      this.ref_emp = decodedToken.ref_emp || '';  // Get user_ref_emp from the decoded token
      this.getUserInfo();  // Once you have the userRefEmp, fetch the user info
    } else {
      console.error('Error decoding token or token is missing');
    }
  }

  onSubmit(identityForm: NgForm) {
    if (identityForm.valid) {
      const formData = {
        user_name: this.fullName,
        user_num: this.personalId,
        user_natio_num: this.nationalNumber,
        user_sifa: this.position,
        user_ref_emp: this.ref_emp
      };

      // Call the service to submit the data
      this.cinService.submitCinRequest(formData).subscribe(
        (response) => {
          console.log('Form submitted successfully', response);
          this.isModalVisible = true;

          setTimeout(() => {
            this.closeModal(); // Close the modal
            this.router.navigate(['/dashboard/definitions-autorisations']);
          }, 3000);
        },
        (error) => {
          console.error('Error submitting the form:', error);
        }
      );
      identityForm.reset();
    }
  }
  closeModal() {
    this.isModalVisible = false;
  }
}