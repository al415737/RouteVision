
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor() { }

  crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: string){
    return null;
  }

  eliminarVehiculo(matricula: string){
    return null;
  }
}
