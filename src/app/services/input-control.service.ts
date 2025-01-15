import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',  // This makes the service available throughout the application
})
export class InputControlService {
  // RegEx for validating full name (Arabic and English letters and spaces)
  validateFullName(fullName: string): boolean {
    const fullNameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
    return fullNameRegex.test(fullName);
  }

  // RegEx for validating email format
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(email);
  }

  // RegEx for validating phone numbers
  validatePhone(phone: string): boolean {
    const phoneRegex = /^091[0-9]{7}$/;
    return phoneRegex.test(phone);
  }

  // Add other validation methods as needed
}
