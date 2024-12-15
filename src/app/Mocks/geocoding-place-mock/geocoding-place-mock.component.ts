import { Component, inject } from '@angular/core';
import { GeocodingService } from '../../APIs/Geocoding/geocoding.service';

@Component({
  selector: 'app-geocoding-place-mock',
  standalone: true,
  imports: [],
  templateUrl: './geocoding-place-mock.component.html',
  styleUrl: './geocoding-place-mock.component.css'
})

export class GeocodingPlaceMockComponent {
  geocoding: GeocodingService = inject(GeocodingService);

  
  conexionAPI(coordenadas: number[]){
    let toponimo = this.geocoding.getToponimo(coordenadas);

    if(toponimo == null)
      return false;
    return true;
  }
}


