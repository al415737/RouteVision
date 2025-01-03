import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { PrecioLuzService } from '../../APIs/PrecioLuz/precioLuz.service';
import { AuthStateService } from '../../utils/auth-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  private _luzApi: PrecioLuzService = inject(PrecioLuzService);
  private authState: AuthStateService = inject(AuthStateService);
  datos:any;
  ngOnInit(): void {
   
  }  
}
