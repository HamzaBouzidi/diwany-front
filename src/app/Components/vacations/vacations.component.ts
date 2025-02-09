import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-vacations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vacations.component.html',
  styleUrl: './vacations.component.css'
})
export class VacationsComponent implements OnInit {

  userPermissions = {
    request_vacation: false,
    view_vacation_list: false
  };

  constructor(
    private userInfoService: UserInfoService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.loadUserPermissions();
  }

  loadUserPermissions(): void {
    const decodedToken = this.tokenService.decodeToken();
    const userRefEmp = decodedToken?.ref_emp;

    if (userRefEmp) {
      this.userInfoService.getUserAuthorizations(userRefEmp).subscribe(
        (response) => {
          if (response?.permissions) {
            this.userPermissions = {
              request_vacation: response.permissions.request_vacation || false,
              view_vacation_list: response.permissions.view_vacation_list || false
            };
          }
          console.log('User Permissions:', this.userPermissions);
        },
        (error) => {
          console.error('Error fetching user permissions:', error);
        }
      );
    } else {
      console.error('User reference not found in token');
    }
  }
}
