import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');

    if (token) {
      // Token exists, allow access to the route
      return true;
    } else {
      // Token does not exist, redirect to login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
