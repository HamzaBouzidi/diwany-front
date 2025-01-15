import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  // Decode the JWT token and return the payload
  decodeToken(): any {
    const token = localStorage.getItem('auth_token');

    if (token) {
      try {
        return jwtDecode(token);  // Decode and return the token payload
      } catch (error) {
        console.error('Error decoding token', error);
        return null;
      }
    }
    return null;
  }

  // Optionally, check if the token is expired (you can use the `exp` field from the token)
  isTokenExpired(): boolean {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const expiryTime = decodedToken?.exp;
      const currentTime = Math.floor(new Date().getTime() / 1000); // Current time in seconds
      return expiryTime < currentTime;
    }
    return true; // Token doesn't exist or is expired
  }
}
