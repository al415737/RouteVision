import { inject, Injectable } from '@angular/core';
import { Route } from '../../modelos/route';
import { RouteRepository } from '../interfaces/route-repository';
import { FirestoreService } from './firestore.service';
import { Vehiculo } from '../../modelos/vehiculo';
import { ProxyCarburanteService } from '../../utils/proxy-carburante.service';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { firstValueFrom } from 'rxjs';
import { Place } from '../../modelos/place';

@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{
  servicioAPI: OpenRouteService = inject(OpenRouteService);

  constructor(private _firestore: FirestoreService, private proxy: ProxyCarburanteService,  private _geocoding: OpenRouteService) {}
  
  async calcularRuta(origen: string, destino: string, metodoMov: string) {
      const origenCoord = await new Promise<string> ((resolve) => {
        this.servicioAPI.searchToponimo(origen).subscribe({
          next: (response: any) => {
              const coordenadas = response.features[0].geometry.coordinates;
              resolve(`${coordenadas[0]},${coordenadas[1]}`);
          }
        });
      });

      const destinoCoord = await new Promise<string> ((resolve) => {
        this.servicioAPI.searchToponimo(destino).subscribe({
          next: (response: any) => {
              const coordenadas = response.features[0].geometry.coordinates;
              resolve(`${coordenadas[0]},${coordenadas[1]}`);
          }
        });
      });

      return firstValueFrom(this.servicioAPI.getRuta(origenCoord, destinoCoord, metodoMov));
  }

  
  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route,): Promise<number> {
    const existVehiculo = this._firestore.ifExistVehicle(vehiculo);

    // Si el vehículo no es del usuario logueado
    if (!existVehiculo) return -1;

    const listaMunicipios = await this.proxy.getMunicipios();

    const municipio = listaMunicipios.find((Municipio: any) => Municipio.Municipio === ruta.getOrigen());
    const idMunicipio = municipio.IDMunicipio;

    const estacionesEnMunicipio = await this.proxy.getEstacionesEnMunicipio(idMunicipio);

    const precioStr = estacionesEnMunicipio.ListaEESSPrecio[0]["Precio Gasolina 95 E5"];

    let precioNum = parseFloat(precioStr.replace(',', '.'));

    let costeRuta = parseFloat((ruta.getKm() / 100 * vehiculo.getConsumo() * precioNum).toFixed(2)); 
    console.log('El coste de la ruta es: ' + costeRuta + '€');
    return costeRuta;
  }

  async getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any> {
    const existPlace: boolean = await this._firestore.ifExistPlace(start);
    const existPlace2: boolean = await this._firestore.ifExistPlace(end);

    if(!existPlace || !existPlace2)
        return [];

    const response: any = await this._geocoding.getRouteFSE(start.getCoordenadas(), end.getCoordenadas(), movilidad, preferencia);
    return response;
}
}