import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "../../shared/navbar/navbar.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent, FooterComponent, RouterOutlet, NavbarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
