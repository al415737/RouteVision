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
    const listaMunicipios = await firstValueFrom(this.precioCarburante.getMunicipios());
    //console.log(listaMunicipios);

    const municipio = listaMunicipios.find((Municipio: any) => Municipio.Municipio === ruta.getOrigen());
    const idMunicipio = municipio.IDMunicipio;
    //console.log(idMunicipio);

    const estacionesEnMunicipio = await firstValueFrom(this.precioCarburante.getEstacionesEnMunicipio(idMunicipio));
    //console.log(estacionesEnMunicipio);

    const precioStr = estacionesEnMunicipio.ListaEESSPrecio[0]["Precio Gasolina 95 E5"];
    //console.log(precioStr);
    
    let precioNum = parseFloat(precioStr.replace(',', '.'));  
    //console.log(precioNum); 
  
    let costeRuta = parseFloat((ruta.getKm() / 100 * vehiculo.getConsumo() * precioNum).toFixed(2)); 
    console.log('El coste de la ruta es: ' + costeRuta + '€');
    return costeRuta;
  }
}