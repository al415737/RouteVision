import { Injectable } from '@angular/core';
import { Place } from '../modelos/place';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor() { }

  // Conseguir una ruta rápida, corta o económica
  getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): string[] {
    return [];
  }
}
