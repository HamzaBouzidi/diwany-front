import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class HrGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    const isHr = localStorage.getItem('isHr') === 'true';

    if (isHr) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
};
