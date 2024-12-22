import { inject, Injectable } from '@angular/core';
import { Route } from '../../modelos/route';
import { RouteRepository } from '../interfaces/route-repository';
import { FirestoreService } from './firestore.service';
import { firstValueFrom } from 'rxjs';
import { Vehiculo } from '../../modelos/vehiculo';
import { PrecioCarburantes } from '../../APIs/PrecioCarburantes/precioCarburantes.service';

@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{

    private origen: any;
    private destino: any;
    private trayectoria: any;
    private kilometros: any;

  firestore: FirestoreService = inject(FirestoreService);
  precioCarburante: PrecioCarburantes = inject(PrecioCarburantes);

  constructor() {}

  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route): Promise<number> {
    const precios = await firstValueFrom(this.precioCarburante.getFuelPrices());

    let precioC = -1;
    console.log(precios); //va OK
    console.log(precios.ListaEESSPrecio); //va OK también
    console.log(precios.ListaEESSPrecio[4].provincia);   //devuelve UNDEFINED
    console.log(precios.ListaEESSPrecio[4].precioGasolina95);  //devuelve UNDEFINED

    for(let bloque of precios.ListaEESSPrecio){
      //console.log('A');
      // console.log()
      // console.log(bloque.localidad);
      // console.log(bloque.precioGasolina95);
      if(bloque.provincia == ruta.getOrigen){ 
        //console.log(bloque.localidad);
        precioC = bloque.precioGasolina95;
        //console.log(bloque.precioGasolina95);
      }
    } 
    if (precioC == -1){
      console.log(precioC);
    } else {
      console.log(precioC);
    }

    let costeRuta = ruta.getKm() / 100 * vehiculo.getConsumo() * precioC;        
    return costeRuta;
  }
}