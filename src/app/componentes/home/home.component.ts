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
    this._luzApi.getPrecios().subscribe({
      next: (response) => {
        this.datos = response.included; // Guardar los datos obtenidos
        const pvpc = this.datos.find((item: any) => item.type === "PVPC");
        const pvpcValues = pvpc.attributes.values.map((pvpcItem: { datetime: string; value: number }) => ({
          datetime: pvpcItem.datetime,
          pvpc_value: pvpcItem.value,
        }));
  
        console.log(pvpcValues);
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      },
      complete: () => {
        console.log('Solicitud completada.');
      },
    });
  }  
}
