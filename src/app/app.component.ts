import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignUpComponent } from "./componentes/sign-up/sign-up.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SignUpComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RouteVision';
}
