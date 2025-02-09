import { Component } from '@angular/core';
import { NgClass } from '@angular/common'; // Import NgClass if needed
import { Router } from '@angular/router';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass, NavbarComponent], 
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  employeeName: string = '';
  job_title: String = '';
  refEmp: string | undefined;
  constructor(
    private userService: UserInfoService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken();
  }

  // Fetch user reference from token and load user info
  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.refEmp = decodedToken.ref_emp;
      this.getUserInfo(); // Load additional user info
    } else {
      console.error('Error decoding token or token missing');
    }
  }

  getUserInfo(): void {
    if (this.refEmp) {
      this.userService.getUserInfo(this.refEmp).subscribe(
        (response) => {
          this.employeeName = response.nm || '';
          this.job_title = response.b;
        },
        (error) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }
  onLogout(): void {
    // Clear authentication tokens or session
    console.log('Logout button clicked!');

    localStorage.clear();
    // Redirect to the login page
    this.router.navigate(['/login']);
  }

}
