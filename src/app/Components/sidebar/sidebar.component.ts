import { Component } from '@angular/core';
import { NgClass } from '@angular/common'; // Import NgClass if needed

@Component({
  selector: 'app-sidebar',
  standalone: true, // Declare the component as standalone
  imports: [NgClass], // Import other necessary modules like NgClass
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

}
