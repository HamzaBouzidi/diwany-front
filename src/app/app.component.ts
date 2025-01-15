import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShortVacationRequestComponent } from './Components/short-vacation-request/short-vacation-request.component';
import { NationalIdentityCardComponent } from "./Components/national-identity-card/national-identity-card.component";
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { LayoutComponent } from './Components/layout/layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ShortVacationRequestComponent, NationalIdentityCardComponent, SidebarComponent,LayoutComponent],
  templateUrl: './app.component.html', 
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'ejaz';
}
