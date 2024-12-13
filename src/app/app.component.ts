import { Component } from '@angular/core';
import SignInComponent from './componentes/sign-in/sign-in.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SignInComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RouteVision';
}
