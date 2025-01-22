import { Component, OnInit } from '@angular/core';
import { UserInfoService } from '../../services/user/user-info.service';
import { TokenService } from '../../services/token/token.service';
import { PledgeService } from '../../services/pledge/pledge.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pledge-upload',
  standalone: true,
  imports: [],
  templateUrl: './pledge-upload.component.html',
  styleUrl: './pledge-upload.component.css'
})
export class PledgeUploadComponent implements OnInit {

  fileName: string = '';
  selectedFile: File | null = null;

  // User information
  ref_emp: string = '';
  employeeName: string = '';
  employeeDegree: string = '';

  constructor(
    private userService: UserInfoService,
    private tokenService: TokenService,
    private pledgeService: PledgeService
  ) { }

  ngOnInit(): void {
    this.getUserRefFromToken(); // Populate user information
  }

  // Extract `ref_emp` from token and fetch user info
  getUserRefFromToken(): void {
    const decodedToken = this.tokenService.decodeToken();
    if (decodedToken) {
      this.ref_emp = decodedToken.ref_emp || ''; // Get user_ref_emp from the decoded token
      this.getUserInfo(); // Fetch user info using ref_emp
    } else {
      console.error('Error decoding token or token is missing');
    }
  }

  // Fetch user information using `ref_emp`
  getUserInfo(): void {
    if (this.ref_emp) {
      this.userService.getUserInfo(this.ref_emp).subscribe(
        (response) => {
          this.employeeName = response.nm || ''; // Populate employee name
          this.employeeDegree = response.d1 || ''; // Populate employee degree
        },
        (error: HttpErrorResponse) => {
          console.error('Error fetching user info:', error);
        }
      );
    }
  }

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB. Please select a smaller file.');
        this.resetFile();
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a PDF, JPEG, PNG, or DOCX file.');
        this.resetFile();
        return;
      }

      this.selectedFile = file;
      this.fileName = file.name; // Update fileName correctly
      console.log('Selected file:', file);
      console.log(this.fileName)
    } else {
      this.resetFile();
    }
  }

  // Handle file upload
  onUpload(): void {
    console.log(this.selectedFile)
    if (this.selectedFile) {
      const formData = new FormData();

      formData.append('document', this.selectedFile); // Attach the file
      formData.append('employee_rw', this.ref_emp); // Include employee reference
      formData.append('employeeName', this.employeeName); // Include employee name
      formData.append('employeeDegree', this.employeeDegree); // Include employee degree
      console.log(formData)


      // Call the pledge service to upload the file
      this.pledgeService.addPledge(formData).subscribe(
        (response) => {
          alert('File uploaded successfully!');
          console.log('Upload response:', response);
          this.resetFile();
        },
        (error: HttpErrorResponse) => {
          console.error('Error uploading file:', error);
          alert('Failed to upload file. Please try again.');
        }
      );
    } else {
      alert('Please select a file to upload.'); // Ensure this condition works properly
    }
  }

  // Reset file selection
  private resetFile(): void {
    this.fileName = '';
    this.selectedFile = null;
  }
}