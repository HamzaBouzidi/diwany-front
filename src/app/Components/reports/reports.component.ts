import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../services/member/member.service';
import { ReleaseService } from '../../services/release/release.service';
import { EvaluationReportService } from '../../services/evaluationReport/evaluation-report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent {
  searchTerm: string = ''; // For search functionality
  reports: any[] = []; // Array to hold the data based on the selected type
  filteredReports: any[] = []; // Filtered array for search functionality
  selectedReportType: string = 'member'; // Default selection is 'member'
  tableHeaders: string[] = []; // Dynamic table headers

  constructor(
    private memberService: MemberService,
    private releaseService: ReleaseService,
    private evaluationService: EvaluationReportService
  ) { }

  ngOnInit(): void {
    this.loadReports('member'); // Load default reports on initialization
  }

  // Function to load reports based on the selected report type
  loadReports(reportType: string): void {
    this.selectedReportType = reportType;

    switch (reportType) {
      case 'member':
        this.loadMemberReports();
        break;
      case 'release':
        this.loadReleaseReports();
        break;
      case 'evaluation':
        this.loadEvaluationReports();
        break;
    }
  }

  // Load member reports and set the headers to show user-specific fields
  loadMemberReports(): void {
    this.memberService.getMembers().subscribe((data) => {
      // Only include user_name, user_direction_nomi, user_dipl, day, and user_cu_direction
      this.reports = data.map((report: any) => ({
        user_name: report.user_name,
        user_direction_nomi: report.user_direction_nomi,
        user_dipl: report.user_dipl,
        day: report.day,
        user_cu_direction: report.user_cu_direction
      }));

      // Set table headers for member reports
      this.tableHeaders = ['اسم المستخدم', 'ترشيح الاتجاه', 'الدبلوم', 'اليوم', 'الاتجاه الحالي', 'الإجراءات'];

      this.applyFilter(); // Apply filter on loaded data
    });
  }

  // Load release reports and set the headers
  loadReleaseReports(): void {
    this.releaseService.getReleases().subscribe((data) => {
      // Only include directorName, employeeName, and department
      this.reports = data.map((report: any) => ({
        directorName: report.directorName,
        employeeName: report.employeeName,
        department: report.department
      }));

      // Set table headers for release reports
      this.tableHeaders = ['اسم المدير', 'اسم الموظف', 'الإدارة', 'الإجراءات'];

      this.applyFilter(); // Apply filter on loaded data
    });
  }

  // Load evaluation reports and set the headers
  loadEvaluationReports(): void {
    this.evaluationService.getEvaluationReports().subscribe((data) => {

      this.reports = data.map(report => ({
        name: report.name || '',
        jobTitle: report.jobTitle || '',
        nationalId: report.nationalId || '',
        department: report.department || '',
        jobKnowledge: report.jobKnowledge || '',
        technicalSkills: report.technicalSkills || '',
        teamwork: report.teamwork || '',
        problemSolving: report.problemSolving || '',
        timeManagement: report.timeManagement || '',
        decisionMaking: report.decisionMaking || '',
        
      }));
      this.tableHeaders = [
        'الاسم', 'الوظيفة', 'الرقم الوطني', 'الإدارة', 'المعرفة الوظيفية',
        'المهارات التقنية', 'العمل الجماعي', 'حل المشكلات', 'إدارة الوقت',
        'اتخاذ القرار', 'الإجراءات'
      ];      this.applyFilter(); 
    });
  }

  
  applyFilter(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredReports = this.reports.filter((report) =>
      Object.values(report).some(value =>
        String(value).toLowerCase().includes(search)
      )
    );
    
  }

  // Change report type and load the corresponding reports
  onReportTypeChange(reportType: string): void {
    this.loadReports(reportType);
  }

  // Helper function to get keys dynamically for the table rows
  getKeys(report: any): string[] {
    return Object.keys(report).filter(key => {
      const displayName = this.getDisplayName(key);
      return this.tableHeaders.includes(displayName); // Exclude 'الإجراءات'
    });
  }

  // Helper function to map object keys to display names (Arabic headers)
  getDisplayName(key: string): string {
    const mapping: { [key: string]: string } = {
      user_name: 'اسم المستخدم',
      user_direction_nomi: 'ترشيح الاتجاه',
      user_dipl: 'الدبلوم',
      day: 'اليوم',
      user_cu_direction: 'الاتجاه الحالي',
      directorName: 'اسم المدير',
      employeeName: 'اسم الموظف',
      department: 'الإدارة',
      startDate: 'تاريخ المباشرة',
      endDate: 'تاريخ انتهاء فترة الاختبار',
      jobKnowledge: 'المعرفة الوظيفية',
      technicalSkills: 'المهارات التقنية',
      teamwork: 'العمل الجماعي',
      problemSolving: 'حل المشكلات',
      timeManagement: 'إدارة الوقت',
      decisionMaking: 'اتخاذ القرار'
    };
    return mapping[key] || key;
  }
}
