import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {

}
