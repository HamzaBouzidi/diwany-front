import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { MemberService } from '../../../services/member/member.service';

@Component({
  selector: 'app-hr-nomination-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-nomination-list.component.html',
  styleUrl: './hr-nomination-list.component.css'
})
export class HrNominationListComponent implements OnInit {
  members: any[] = [];
  isLoading = true;
  errorMessage = '';
  isModalVisible = false;
  selectedMember: any = null;

  constructor(private http: HttpClient, private memberService: MemberService) { }

  ngOnInit(): void {
    this.fetchMembers();
  }

  // Fetch members from the service
  fetchMembers(): void {
    this.memberService.getMembers().subscribe(
      (data) => {
        this.members = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch nomination members.';
        console.error('Error fetching members:', error);
        this.isLoading = false;
      }
    );
  }

  viewDetails(member: any): void {
    this.selectedMember = member; // Store the selected member
    this.isModalVisible = true; // Show the modal
  }

  // Close the modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedMember = null; // Clear the selected member
  }
}
