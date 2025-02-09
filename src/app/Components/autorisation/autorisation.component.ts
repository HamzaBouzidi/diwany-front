import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-autorisation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './autorisation.component.html',
  styleUrl: './autorisation.component.css'
})
export class AutorisationComponent implements OnInit {

  userPermissions: any = {};

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
          this.userPermissions = {
            request_exit_auth: response.permissions.request_exit_auth,
            request_morning_delay: response.permissions.request_morning_delay,
          };
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
