import { ReleaseService } from './../../../services/release/release.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfoService } from '../../../services/user/user-info.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hr-release-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-release-form.component.html',
  styleUrls: ['./hr-release-form.component.css'],
})
export class HrReleaseFormComponent implements OnInit {
  directorName: string = '';
  directorRw: string = ''; // Holds the director reference
  employeeName: string = '';
  employeeRw: string = ''; // Holds the employee reference
  department: string = '';
  reason: string = '';
  isModalVisible: boolean = false;
  departments: string[] = []; // List of departments

  constructor(private userInfoService: UserInfoService, private releaseService: ReleaseService, private router: Router) { }

  ngOnInit(): void {
    // Fetch all departments on component initialization
    this.userInfoService.getAllDepartments().subscribe(
      (data) => {
        if (data.success) {
          this.departments = data.departments; // Populate the departments list
        }
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  // Method to fetch director info when department is selected
  onDepartmentChange(): void {
    if (this.department) {
      this.userInfoService.getDirectorByDepartment(this.department).subscribe(
        (data) => {
          if (data.success) {
            this.directorName = data.director.name; // Populate the director's name
            this.directorRw = data.director.rw; // Populate the director's rw
          }
        },
        (error) => {
          console.error('Error fetching director info:', error);
        }
      );
    }
  }

  // Method to fetch employee RW when employee name is entered
  onEmployeeNameChange(): void {
    if (this.employeeName) {
      this.userInfoService.getEmployeeRwByName(this.employeeName).subscribe(
        (data) => {
          if (data.success) {
            this.employeeRw = data.employee.rw; // Populate the employee's rw
          }
        },
        (error) => {
          console.error('Error fetching employee RW:', error);
          this.employeeRw = ''; // Reset if there's an error
        }
      );
    } else {
      this.employeeRw = ''; // Clear if the employee name is empty
    }
  }

  // Method to handle form submission
  onSubmit(clearanceForm: NgForm): void {
    if (clearanceForm.valid) {
      const formData = {
        directorName: this.directorName,
        directorRw: this.directorRw,
        employeeName: this.employeeName,
        employeeRw: this.employeeRw,
        department: this.department,
        reason: this.reason,
      };

      this.releaseService.submitReleaseForm(formData).subscribe(
        (response) => {
          console.log('Release form submitted successfully:', response);
          this.isModalVisible = true;
          clearanceForm.reset();
          setTimeout(() => {
            this.closeModal(); // Close the modal
            this.router.navigate(['/dashboard/definitions-autorisations']);
          }, 3000);
        },
        (error) => {
          console.error('Error submitting release form:', error);
        }
      );
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
