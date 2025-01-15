import { Component } from '@angular/core';
import { HrSidebarComponent } from '../../Components/hr-sidebar/hr-sidebar.component';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-hr-layout',
  standalone: true,
  imports: [HrSidebarComponent, RouterOutlet, NavbarComponent],
  templateUrl: './hr-layout.component.html',
  styleUrl: './hr-layout.component.css'
})
export class HrLayoutComponent {

}
