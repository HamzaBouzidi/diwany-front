import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { MemberService } from '../../services/member/member.service';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-member-nomination-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DoneModalComponent],
  templateUrl: './member-nomination-form.component.html',
  styleUrl: './member-nomination-form.component.css'
})
export class MemberNominationFormComponent {

  // Form fields
  candidateName: string = '';
  nominationDirection: string = '';
  nominationDate: string = '';
  currentJob: string = '';
  joiningDate: string = '';
  qualifications: string = '';
  experience: string = '';
  nationality: string = '';
  ref_emp: string | undefined;
  isModalVisible: boolean = false;



  constructor(

    private userService: UserInfoService,
    private tokenService: TokenService,
    private memberService: MemberService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken();
    this.setCurrentDate();
  }
  setCurrentDate(): void {
    const today = new Date();
    this.nominationDate = today.toISOString().split('T')[0];
  }
  // Fetch user information using userRefEmp
  getUserInfo(): void {
    if (this.ref_emp) {
      this.userService.getUserInfo(this.ref_emp).subscribe(
        (response) => {
          this.candidateName = response.nm || '';
          this.nominationDirection = response.d || '';
          this.currentJob = response.h3 || '';
          this.joiningDate = response.dmar || '';
          this.qualifications = response.d1 || '';

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
      this.ref_emp = decodedToken.ref_emp || '';

      this.getUserInfo();
    } else {
      console.error('Error decoding token or token is missing');
    }
  }

  // Method to handle form submission
  onSubmit(nominationForm: NgForm) {
    if (nominationForm.valid) {
      const formData = {
        user_name: this.candidateName,
        user_direction_nomi: this.nominationDirection,
        day: this.nominationDate,
        user_cu_direction: this.currentJob,
        start_day: this.joiningDate,
        user_dipl: this.qualifications,
        user_exp: this.experience,
        user_natio: this.nationality,
        user_ref_emp: this.ref_emp
      };

      this.memberService.submitMemberRequest(formData).subscribe(
        (response) => {
          console.log('Form submitted successfully:', response);
          this.isModalVisible = true;
          setTimeout(() => {
            this.closeModal();
            this.router.navigate(['/dashboard/definitions-autorisations']);
          }, 3000);
          nominationForm.reset();
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
  closeModal() {
    this.isModalVisible = false;
  }
}