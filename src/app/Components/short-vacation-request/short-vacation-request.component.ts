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
import { NotificationService } from '../../services/notification/notification.service';

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

  availableVacationDays: number = 0;




  isSuccessModalVisible: boolean = false; // Shows after successful submission
  isErrorModalVisible: boolean = false; // Shows when requested days exceed available days
  remainingVacationDays: number = 0; // Stores remaining days after valid submission


  openModal() {
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
  }

  constructor(
    private userInfoService: UserInfoService,
    private notificationService: NotificationService,

    private userService: UserInfoService,
    private tokenService: TokenService,
    private vacationService: VacationService,
    private router: Router 

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
          this.availableVacationDays = response.ras || 0;
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

  // onVacationDurationChange() {
  // this.calculateVacationEndDate();
  //}

  onVacationDurationChange(): void {
    if (this.vacationDuration! > this.availableVacationDays) {
      this.isErrorModalVisible = true;
    } else {
      this.calculateVacationEndDate();
    }
  }

  closeErrorModal(): void {
    this.isErrorModalVisible = false;
    this.vacationDuration = undefined; // Reset duration input
  }

  onVacationStartDateChange() {
    this.calculateVacationEndDate();
  }


  showErrorModal(): void {
    this.isErrorModalVisible = true;
  }

  /* closeErrorModal(): void {
     this.isErrorModalVisible = false;
   }
     */
  // Method to handle form submission
 /* onSubmit(form: NgForm): void {
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

          setTimeout(() => {
            this.router.navigate(['/dashboard/vacations/vacations-list']);
          }, 1000);
        },
        (error) => {

          console.error('Error submitting vacation request:', error);
        }
      );
    } else {

    }
  }
  */


  onSubmit(form: NgForm): void {
    if (!form.valid || this.vacationDuration! > this.availableVacationDays) {
      return;
    }

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
        this.remainingVacationDays = this.availableVacationDays - this.vacationDuration!;
        this.isSuccessModalVisible = true;
        // 1. Récupérer le directeur RW
        if (this.ref_emp) {
          this.userInfoService.getDirectorRw(this.ref_emp).subscribe(
            (directorRw) => {

              console.log(directorRw)
              // 2. Créer la notification après avoir récupéré le directeur RW
              const notificationText = `طلب إجازة جديد من ${this.employeeName}`;
              this.notificationService.addNotification(notificationText, this.ref_emp!, directorRw).subscribe(
                () => {
                  console.log('Notification envoyée avec succès');
                },
                (error) => {
                  console.error('Erreur lors de l\'envoi de la notification:', error);
                }
              );
            },
            (error) => {
              console.error('Erreur lors de la récupération du directeur RW:', error);
            }
          );
        }




      },
      (error) => {
        console.error('Error submitting vacation request:', error);
      }
    );
  }

  closeSuccessModal(): void {
    this.isSuccessModalVisible = false;
    this.router.navigate(['/dashboard/vacations/vacations-list']);
  }
}
