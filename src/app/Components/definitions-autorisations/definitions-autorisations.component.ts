import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-definitions-autorisations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './definitions-autorisations.component.html',
  styleUrl: './definitions-autorisations.component.css'
})
export class DefinitionsAutorisationsComponent implements OnInit {

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
            request_nomination: response.permissions.request_nomination,
            view_nomination_list: response.permissions.view_nomination_list,
            request_pledge: response.permissions.request_pledge,
            view_pledge_list: response.permissions.view_pledge_list,
            request_release: response.permissions.request_release,
            view_release_list: response.permissions.view_release_list,
            request_cin: response.permissions.request_cin,
            view_cin_list: response.permissions.view_cin_list,
            request_health_assurance: response.permissions.request_health_assurance,
            view_health_assurance_list: response.permissions.view_health_assurance_list
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
