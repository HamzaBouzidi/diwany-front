import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MorningAuthorisationService } from '../../services/morningAuthorisation/morning-authorisation.service';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-morning-autorisation-request',
  standalone: true,
  imports: [CommonModule, FormsModule, DoneModalComponent],
  templateUrl: './morning-autorisation-request.component.html',
  styleUrl: './morning-autorisation-request.component.css'
})
export class MorningLateRequestComponent {
  employeeName: string = '';
  reason: string = '';
  date: string = '';
  arrivalTime: string = '';
  ref_emp: string | undefined;
  isModalVisible: boolean = false;


  constructor(

    private userService: UserInfoService,
    private tokenService: TokenService,
    private exitAuthorizationService: MorningAuthorisationService,
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
  closeModal() {
    this.isModalVisible = false;

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
  // Method to handle form submission
  onSubmit(exitAutorisationForm: NgForm) {
    if (exitAutorisationForm.valid) {
      const formData = {
        employee_rw: this.ref_emp, 
        name: this.employeeName,
        day: this.date,
        time: this.arrivalTime,
        description: this.reason,

      }

      // Call the service to submit the data
      this.exitAuthorizationService.submitMorningAuthorization(formData).subscribe(
        (response) => {
          console.log('Form submitted successfully', response);
          this.isModalVisible = true;
          setTimeout(() => {
            this.closeModal();
            this.router.navigate(['/dashboard/autorisation/autorisation-list']);
          }, 3000);
        },
        (error) => {
          console.error('Error submitting the form:', error);
        }
      );
    }
  }

}
