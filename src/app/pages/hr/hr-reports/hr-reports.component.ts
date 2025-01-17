import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DoneModalComponent } from '../../../shared/modal/done-modal/done-modal.component';

@Component({
  selector: 'app-hr-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hr-reports.component.html',
  styleUrl: './hr-reports.component.css'
})
export class HrReportsComponent {

}
