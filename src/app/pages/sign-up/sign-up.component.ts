import { Component } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MyButtonComponent } from "../../shared/my-button/my-button.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { BlockModalComponent } from '../../shared/modal/block-modal/block-modal/block-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, MyButtonComponent, FooterComponent, DoneModalComponent, BlockModalComponent], 
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  fullName: string = '';
  email: string = '';
  nationalId: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';

  buttonClass: string = 'blue-button';
  buttonType: 'submit' = 'submit';
  text: string = 'قم بالتسجيل';
  isErrorModalVisible: boolean = false;
  isModalVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  isFormValid(): boolean {
    return (
      this.fullName.length > 0 &&
      this.email.length > 0 &&
      this.nationalId.length > 0 &&
      this.phone.length > 0 &&
      this.password === this.confirmPassword &&
      this.password.length >= 6
    );
  }

  onSubmit(registrationForm: NgForm) {
    if (this.isFormValid() && registrationForm.valid) {
      const userData = {
        user_name: this.fullName,
        user_email: this.email,
        user_ref_emp: this.nationalId,
        user_phone: this.phone,
        password: this.password
      };

      this.authService.signup(userData).subscribe(
        response => {
          console.log('User registered successfully:', response);
          this.isModalVisible = true;
          registrationForm.reset();
          setTimeout(() => {
            this.closeModal();
            this.router.navigate(['/login']);
          }, 3000);
        },
        error => {
          console.error('Error during registration:', error);
          this.isErrorModalVisible = true;
        }
      );
    } else {
      this.snackBar.open('تأكد من ملء جميع الحقول بشكل صحيح.', 'إغلاق', {
        duration: 5000,
      });
    }

  }
  closeModal() {
    this.isModalVisible = false;
    this.isErrorModalVisible = false;
  }
}
