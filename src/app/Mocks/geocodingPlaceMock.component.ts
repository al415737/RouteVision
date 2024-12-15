import { Component, inject } from '@angular/core';
import { GeocodingService } from '../APIs/Geocoding/geocoding.service';

export class geocodingPlaceMock {
  geocoding: GeocodingService = inject(GeocodingService);

  conexionAPI(coordenadas: number[]){
    let toponimo = this.geocoding.getToponimo(coordenadas);

    if(toponimo == null)
      return false;
    return true;
  }
}
