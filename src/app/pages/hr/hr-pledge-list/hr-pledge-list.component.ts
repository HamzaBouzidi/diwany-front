import { Component, OnInit } from '@angular/core';
import { PledgeService } from '../../../services/pledge/pledge.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-hr-pledge-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-pledge-list.component.html',
  styleUrl: './hr-pledge-list.component.css'
})
export class HrPledgeListComponent implements OnInit {
  pledges: any[] = [];
  filteredPledges: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  isModalVisible: boolean = false;
  selectedPledge: any = null;
  notifications: string[] = [];

  constructor(private pledgeService: PledgeService) { }

  ngOnInit(): void {
    this.fetchPledges();
  }
/*
  fetchPledges(): void {
    this.isLoading = true;
    this.pledgeService.getAllPledges().subscribe(
      (data) => {
        this.pledges = data;
        this.filteredPledges = data;
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching pledges:', error);
        this.errorMessage = 'Failed to load pledges. Please try again.';
        this.isLoading = false;
      }
    );
  }
*/

  fetchPledges(): void {
    this.isLoading = true;
    this.pledgeService.getAllPledges().subscribe(
      (data) => {
        const now = new Date();
        // Map the data and identify new pledges
        this.pledges = data.map((pledge: any) => ({
          ...pledge,
          //isNew: pledge.state === 'pending' && this.isNewRequest(pledge.createdAt), // Mark as new
          isPending: pledge.state === 'pending',
        }));

        this.filteredPledges = [...this.pledges];
        // this.checkForNewPledges(); // Check for new pledges and add notifications
        this.checkForPendingPledges();
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching pledges:', error);
        this.errorMessage = 'Failed to load pledges. Please try again.';
        this.isLoading = false;
      }
    );
  }


  openModal(pledge: any): void {
    this.selectedPledge = pledge;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedPledge = null;
  }
  openDocument(documentPath: string): void {
    const fullUrl = `${environment.apiBaseUrl}/${documentPath}`;
    window.open(fullUrl, '_blank');
  }

  updatePledgeState(state: string): void {
    if (this.selectedPledge) {
      this.pledgeService.updatePledgeState(this.selectedPledge.id, { state }).subscribe(
        (response) => {
          console.log('Pledge state updated:', response);
          this.selectedPledge.state = state; // Update the state in the UI
          this.fetchPledges(); // Refresh the table
          this.closeModal(); // Close the modal
        },
        (error) => {
          console.error('Error updating pledge state:', error);
          alert('Failed to update pledge state. Please try again.');
        }
      );
    }
  }


  filterPledges(): void {
    const searchTermLower = this.searchTerm.toLowerCase().trim();

    if (!searchTermLower) {
      this.filteredPledges = [...this.pledges];
      return;
    }

    this.filteredPledges = this.pledges.filter((pledge) =>
      pledge.employeeName?.toLowerCase().includes(searchTermLower) ||
      pledge.employee_rw?.toString().includes(searchTermLower) || // Allow searching by employee number
      pledge.employeeDegree?.toLowerCase().includes(searchTermLower)
    );
  }

  // Check if the pledge is new (created within the last 24 hours)
  isNewRequest(createdAt: string): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return new Date(createdAt) > oneDayAgo;
  }

  // Check for new pledges and add notifications
  /* checkForNewPledges(): void {
     const newPledges = this.pledges.filter((pledge) => pledge.isNew);
     newPledges.forEach((pledge) => {
       this.addNotification(`إقرار جديد: ${pledge.employeeName}`);
     });
   }
 */
  // Check for pending pledges and add notifications
  checkForPendingPledges(): void {
    const pendingPledges = this.pledges.filter((pledge) => pledge.isPending);
    if (pendingPledges.length > 0) {
      this.addNotification(`هناك ${pendingPledges.length} إقرارات قيد التنفيذ.`);
    }
  }
  // Add a notification
  addNotification(message: string): void {
    this.notifications.push(message);
    setTimeout(() => {
      this.notifications.shift(); // Remove the notification after 4 seconds
    }, 4000);
  }

  // Close a specific notification
  closeNotification(index: number): void {
    this.notifications.splice(index, 1);
  }


}
