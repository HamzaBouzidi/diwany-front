import { MorningAuthorisationService } from './../../../services/morningAuthorisation/morning-authorisation.service';
import { ExitAuthorisationService } from './../../../services/exitAuthorisation/exit-authorisation.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hr-authorizations-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-authorizations-list.component.html',
  styleUrls: ['./hr-authorizations-list.component.css']
})
export class HrAuthorizationsListComponent implements OnInit {
  exitAuthorizations: any[] = [];
  morningDelays: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  searchTerm: string = '';
  showExitAuthorizations: boolean = true;
  filteredExitAuthorizations: any[] = [];
  filteredMorningDelays: any[] = [];



  constructor(
    private exitauthorizationService: ExitAuthorisationService,
    private morningAuthorisationService: MorningAuthorisationService
  ) { }

  ngOnInit(): void {
    this.fetchAuthorizations();
  }

  fetchAuthorizations(): void {
    this.isLoading = true;

    Promise.all([
      this.exitauthorizationService.getAllExitAuthorizations().toPromise(),
      this.morningAuthorisationService.getAllMorningDelays().toPromise()
    ])
      .then(([exits, delays]) => {
        // Adjust based on the response structure
        this.exitAuthorizations = (exits.exitAuthorizations || exits || []).map((auth: any) => ({
          ...auth,
          state: this.mapState(auth.bossApprovalStatus) 
        }));
        this.morningDelays = (delays.morningDelays || delays || []).map((delay: any) => ({
          ...delay,
          state: this.mapState(delay.bossApprovalStatus) 
        }));

        // Initialize filtered lists
        this.filteredExitAuthorizations = [...this.exitAuthorizations];
        this.filteredMorningDelays = [...this.morningDelays];
        this.isLoading = false;
      })
      .catch((error) => {
        console.error('Error fetching authorizations:', error);
        this.errorMessage = 'Failed to load authorizations. Please try again later.';
        this.isLoading = false;
      });
  }

  toggleTable(table: 'exitAuthorizations' | 'morningDelays'): void {
    this.showExitAuthorizations = table === 'exitAuthorizations';
  }

  /*
  get filteredExitAuthorizations(): any[] {
    return this.exitAuthorizations.filter((auth) =>
      auth.name.includes(this.searchTerm) || auth.exitDescription.includes(this.searchTerm)
    );
  }

  get filteredMorningDelays(): any[] {
    return this.morningDelays.filter((delay) =>
      delay.name.includes(this.searchTerm) || delay.description.includes(this.searchTerm)
    );
  }
*/
  filterAuthorizations(): void {
    const searchTermLower = this.searchTerm.toLowerCase().trim();

    if (!searchTermLower) {
      this.filteredExitAuthorizations = [...this.exitAuthorizations];
      this.filteredMorningDelays = [...this.morningDelays];
      return;
    }

    this.filteredExitAuthorizations = this.exitAuthorizations.filter((auth) =>
      auth.name?.toLowerCase().includes(searchTermLower) ||
      auth.exitDescription?.toLowerCase().includes(searchTermLower) ||
      auth.employee_rw?.toString().includes(searchTermLower) // Search by employee number
    );

    this.filteredMorningDelays = this.morningDelays.filter((delay) =>
      delay.name?.toLowerCase().includes(searchTermLower) ||
      delay.description?.toLowerCase().includes(searchTermLower) ||
      delay.employee_rw?.toString().includes(searchTermLower) // Search by employee number
    );
  }

  private mapState(state: string): string {
    switch (state) {
      case 'Approved':
        return 'مقبولة';
      case 'Rejected':
        return 'مرفوضة';
      case 'Pending':
        return 'قيد الانتظار';
      default:
        return 'غير معروف';
    }
  }
}
