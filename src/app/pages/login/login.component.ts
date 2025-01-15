import { UserInfoService } from './../../services/user/user-info.service';
import { AuthService } from './../../services/auth/auth.service';

import { Component } from '@angular/core';
import { MyButtonComponent } from '../../shared/my-button/my-button.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { FooterComponent } from '../../shared/footer/footer.component';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TokenService } from '../../services/token/token.service';
import { InputControlService } from '../../services/input-control.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { BlockModalComponent } from "../../shared/modal/block-modal/block-modal/block-modal.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MyButtonComponent,
    CommonModule,
    FormsModule,
    FooterComponent,
    HttpClientModule,
    MatSnackBarModule,
    DoneModalComponent,
    BlockModalComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  invalidEmail: boolean = false;
  emptyEmail: boolean = false;
  emptyPassword: boolean = false;
  loginFailed: boolean = false;
  isModalVisible: boolean = false;
  isErrorModalVisible: boolean = false;

  constructor(
    private AuthService: AuthService,
    private userInfoService: UserInfoService,
    private router: Router,
    private tokenService: TokenService,
    private inputControlService: InputControlService,
    private snackBar: MatSnackBar
  ) { }

  onSubmit(registrationForm: NgForm) {
    if (registrationForm.valid) {
      const { email, password } = registrationForm.value;

      // Reset all validation flags before validation
      this.invalidEmail = false;
      this.emptyEmail = false;
      this.emptyPassword = false;
      this.loginFailed = false;

      // Validate if email is empty
      if (!email) {
        this.emptyEmail = true;
        return;
      }

      // Validate email format using the InputControlService
      if (!this.inputControlService.validateEmail(email)) {
        this.invalidEmail = true;
        return;
      }

      // Validate if password is empty
      if (!password) {
        this.emptyPassword = true;
        return;
      }

      // Login process
      this.AuthService.login(email, password).subscribe(
        (response) => {
          // Save the token
          localStorage.setItem('auth_token', response.token);
          console.log('Login successful');

          // Decode the token
          const decodedToken = this.tokenService.decodeToken();
          const refEmp = decodedToken?.ref_emp;

          if (refEmp) {
            // Fetch user information using UserInfoService
            this.userInfoService.getUserInfo(refEmp).subscribe(
              (userInfo) => {
                console.log('User Info:', userInfo);

                // Check if the user is HR
                if (userInfo.job === 'HR') {
                  this.router.navigate(['/dashboard/hr']); // Redirect to HR dashboard
                } else {
                  this.router.navigate(['/dashboard/home']); // Redirect to general dashboard
                }

                this.snackBar.open('تم تسجيل الدخول بنجاح!', 'إغلاق', {
                  duration: 5000,
                });
              },
              (error) => {
                console.error('Error fetching user info:', error);
                this.snackBar.open('حدث خطأ أثناء جلب بيانات المستخدم.', 'إغلاق', {
                  duration: 5000,
                });
              }
            );
          } else {
            console.error('Invalid token or missing ref_emp.');
            this.snackBar.open('حدث خطأ أثناء التسجيل.', 'إغلاق', {
              duration: 5000,
            });
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.snackBar.open('خطأ أثناء تسجيل الدخول. حاول مرة أخرى.', 'إغلاق', {
            duration: 5000,
          });
        }
      );

      registrationForm.reset();
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.isErrorModalVisible = false;
  }
}
