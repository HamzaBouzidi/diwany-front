import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './hr-sidebar.component.html',
  styleUrl: './hr-sidebar.component.css'
})
export class HrSidebarComponent {
  constructor(private router: Router) { }
  onLogout(): void {
    // Clear authentication tokens or session
    console.log('Logout button clicked!');

    localStorage.clear();
    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
