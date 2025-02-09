import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { ExitAuthorisationService } from '../../services/exitAuthorisation/exit-authorisation.service';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../../services/notification/notification.service';

@Component({
  selector: 'app-autorisation-request',
  standalone: true,
  imports: [CommonModule, FormsModule, DoneModalComponent],
  templateUrl: './autorisation-request.component.html',
  styleUrls: ['./autorisation-request.component.css']
})
export class AutorisationRequestComponent {
  employeeName: string = '';
  reason: string = '';
  exitDate: string = '';
  exitTime: string = '';
  returnTime: string = '';
  ref_emp: string | undefined;
  isModalVisible: boolean = false;

  constructor(
    private userService: UserInfoService,
    private notificationService: NotificationService,

    private tokenService: TokenService,
    private exitAuthorizationService: ExitAuthorisationService,
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
        (error: HttpErrorResponse) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    console.log(decodedToken);

    if (decodedToken) {
      this.ref_emp = decodedToken.ref_emp || ''; // Get user_ref_emp from the decoded token
      this.getUserInfo(); // Once you have the userRefEmp, fetch the user info
    } else {
      console.error('Error decoding token or token is missing');
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  // Method to handle form submission
  onSubmit(exitAutorisationForm: NgForm): void {
    if (exitAutorisationForm.valid) {
      const formData = {
        employee_rw: this.ref_emp, // Required by backend
        name: this.employeeName, // Employee name
        day: this.exitDate, // Date of the exit
        exitStartTime: this.exitTime, // Exit start time
        returnTime: this.returnTime, // Return time (changed from exitEndTime)
        exitDescription: this.reason // Reason for the exit
      };

      // Call the service to submit the data
      this.exitAuthorizationService.addExitAuthorization(formData).subscribe(
        (response) => {
          console.log('Form submitted successfully', response);
          this.isModalVisible = true;
          // Step 2: Retrieve the director RW (Manager)
          if (this.ref_emp) {
            this.userService.getDirectorRw(this.ref_emp).subscribe(
              (directorRw) => {
                console.log('Director RW:', directorRw);

                // Step 3: Send a notification to the director
                const notificationText = `طلب إذن خروج جديد من ${this.employeeName}`;
                this.notificationService.addNotification(notificationText, this.ref_emp!, directorRw).subscribe(
                  () => {
                    console.log('Notification sent successfully');
                  },
                  (error) => {
                    console.error('Error sending notification:', error);
                  }
                );
              },
              (error) => {
                console.error('Error retrieving Director RW:', error);
              }
            );
          }

          setTimeout(() => {
            this.closeModal(); // Close the modal
            this.router.navigate(['/dashboard/autorisation/autorisation-list']);
          }, 3000);
        },
        (error: HttpErrorResponse) => {
          console.error('Error submitting the form:', error);
        }
      );
    }
  }
}
