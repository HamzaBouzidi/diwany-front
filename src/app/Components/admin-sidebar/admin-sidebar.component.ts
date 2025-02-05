import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.css'
})
export class AdminSidebarComponent {
  constructor(private router: Router) { }
  onLogout(): void {
    // Clear authentication tokens or session
    console.log('Logout button clicked!');

    localStorage.clear();
    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
