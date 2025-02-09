import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification/notification.service';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  notifications: any[] = [];
  showNotifications = false;
  refEmp: string | undefined;


  constructor(private router: Router, private notificationService: NotificationService, private userService: UserInfoService, private tokenService: TokenService) { }


  ngOnInit(): void {
    this.getUserRefFromToken();
    this.loadNotifications();
  }


  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.refEmp = decodedToken.ref_emp;
    } else {
      console.error('Error decoding token or token missing');
    }
  }

  loadNotifications(): void {
    if (this.refEmp) {
      this.notificationService.getNotifications(this.refEmp).subscribe(
        (data) => {
          this.notifications = data;
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
    }
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId).subscribe(
      () => {
        // Remove from the list after successful deletion
        this.notifications = this.notifications.filter(notif => notif.id !== notificationId);
      },
      (error) => {
        console.error('Error deleting notification:', error);
      }
    );
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  onLogout(): void {
    // Clear authentication tokens or session
    console.log('Logout button clicked!');

    localStorage.clear();
    // Redirect to the login page
    this.router.navigate(['/login']);
  }

}
