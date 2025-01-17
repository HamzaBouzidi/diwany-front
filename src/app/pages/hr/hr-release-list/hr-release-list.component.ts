import { Component, OnInit } from '@angular/core';
import { ReleaseService } from '../../../services/release/release.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hr-release-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-release-list.component.html',
  styleUrl: './hr-release-list.component.css'
})
export class HrReleaseListComponent implements OnInit {
  releases: any[] = []; // List of releases
  filteredReleases: any[] = []; // Filtered list for the search
  searchTerm: string = ''; // Search term
  isLoading: boolean = true; // Loading state
  errorMessage: string = ''; // Error message
  workPeriods: any[] = [];
  filteredWorkPeriods: any[] = [];
  currentView: 'releases' | 'work-periods' = 'releases';

  // Modal state
  isModalVisible: boolean = false;
  selectedReason: string = ''; // Reason to display in the modal

  constructor(private releaseService: ReleaseService) { }

  ngOnInit(): void {
    this.fetchReleases();
    this.fetchWorkPeriods();
  }

  // Fetch all releases
  fetchReleases(): void {
    this.releaseService.getReleases().subscribe(
      (data) => {
        this.releases = data;
        this.filteredReleases = data; // Initialize filtered releases
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'خطأ في جلب البيانات.';
        console.error('Error fetching releases:', error);
        this.isLoading = false;
      }
    );
  }

  // Fetch all work periods
  /* fetchWorkPeriods(): void {
     this.releaseService.getWorkPeriods().subscribe(
       (data) => {
         this.workPeriods = data;
         this.filteredWorkPeriods = data; // Initialize filtered work periods
         this.isLoading = false;
       },
       (error) => {
         this.errorMessage = 'خطأ في جلب بيانات فترات العمل.';
         console.error('Error fetching work periods:', error);
         this.isLoading = false;
       }
     );
   }
     */
  fetchWorkPeriods(): void {

  }

  filterReleases(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredReleases = this.releases.filter((release) =>
      this.matchesSearch(release)
    );
  }

  filterWorkPeriods(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredWorkPeriods = this.workPeriods.filter((period) =>
      this.matchesSearch(period)
    );
  }

  // Filter releases based on the search term
  ngOnChanges(): void {
    this.filteredReleases = this.releases.filter((release) =>
      this.matchesSearch(release)
    );
  }

  matchesSearch(release: any): boolean {
    const term = this.searchTerm.toLowerCase();
    return (
      release.directorName.toLowerCase().includes(term) ||
      release.department.toLowerCase().includes(term) ||
      release.employeeName.toLowerCase().includes(term)
    );
  }

  onSearchChange(): void {
    if (this.currentView === 'releases') {
      this.filterReleases();
    } else if (this.currentView === 'work-periods') {
      this.filterWorkPeriods();
    }
  }

  // Show the reason in a modal
  showReason(release: any): void {
    this.selectedReason = release.reason;
    this.isModalVisible = true;
  }

  // Close the modal
  closeModal(): void {
    this.isModalVisible = false;
    this.selectedReason = '';
  }


  toggleView(view: 'releases' | 'work-periods'): void {
    this.currentView = view;
    this.onSearchChange(); // Update the filtered list based on the search term
  }
}
