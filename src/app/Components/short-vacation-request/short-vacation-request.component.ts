import { Component, OnInit } from '@angular/core';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NgForm } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token/token.service';
import { UserInfoService } from '../../services/user/user-info.service';
import { VacationService } from '../../services/vacation/vacation.service';
import { DoneModalComponent } from "../../shared/modal/done-modal/done-modal.component";

@Component({
  selector: 'app-short-vacation-request',
  standalone: true,
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    CardModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    CommonModule,
    DoneModalComponent
  ],
  templateUrl: './short-vacation-request.component.html',
  styleUrls: ['./short-vacation-request.component.css'],
  providers: [MessageService]
})
export class ShortVacationRequestComponent implements OnInit {
  vacationStartDate: Date | undefined;
  vacationDuration: number | undefined;
  employeeName: string = '';
  vacationPurpose: string = '';
  selectedDepartment: string = '';
  ref_emp: string | undefined;
  vacationEndDate: string | undefined;

  isModalVisible: boolean = false;

  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  constructor(
    private messageService: MessageService,
    private userService: UserInfoService,
    private tokenService: TokenService,
    private vacationService: VacationService,
    private router: Router // Inject Router here
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken();
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

  getUserInfo(): void {
    if (this.ref_emp) {
      this.userService.getUserInfo(this.ref_emp).subscribe(
        (response) => {
          this.employeeName = response.nm || '';
          this.selectedDepartment = response.d || '';
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  calculateVacationEndDate(): void {
    if (!this.vacationStartDate || !this.vacationDuration) {
      this.vacationEndDate = undefined;
      return;
    }

    const startDate = new Date(this.vacationStartDate); // Ensure we use a Date object
    let daysLeft = this.vacationDuration;
    let currentDate = new Date(startDate); // Clone the start date to avoid modifying it

    while (daysLeft > 0) {
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day

      const dayOfWeek = currentDate.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday

      // Skip Fridays (5) and Saturdays (6)
      if (dayOfWeek !== 5 && dayOfWeek !== 6) {
        daysLeft--;
      }
    }

    this.vacationEndDate = currentDate.toISOString().split('T')[0];
  }

  onVacationDurationChange() {
    this.calculateVacationEndDate();
  }

  onVacationStartDateChange() {
    this.calculateVacationEndDate();
  }

  // Method to handle form submission
  onSubmit(form: NgForm): void {
    if (form.valid) {
      const vacationData = {
        employee_rw: this.ref_emp,
        name: this.employeeName,
        department: this.selectedDepartment,
        vacationDays: this.vacationDuration,
        vacationStartDay: this.vacationStartDate,
        vacationEndDate: this.vacationEndDate,
        vacationDescription: this.vacationPurpose
      };


      this.vacationService.addVacation(vacationData).subscribe(
        (response) => {

          console.log(vacationData);
          
        /*  this.messageService.add({
            severity: 'success',
            summary: 'تم إرسال الطلب',
            detail: 'تم تقديم طلب الإجازة بنجاح'
          });
*/
          setTimeout(() => {
            this.router.navigate(['/dashboard/vacations/vacations-list']);
          }, 1000);
        },
        (error) => {
        /*  this.messageService.add({
            severity: 'error',
            summary: 'خطأ في الطلب',
            detail: 'حدث خطأ أثناء تقديم الطلب'
          });*/
          console.error('Error submitting vacation request:', error);
        }
      );
    } else {
     /* this.messageService.add({
        severity: 'error',
        summary: 'خطأ في الطلب',
        detail: 'يرجى تعبئة الحقول بشكل صحيح'
      });*/
    }
  }
}
