import { inject, Injectable } from '@angular/core';
import { Route } from '../../modelos/route';
import { RouteRepository } from '../interfaces/route-repository';
import { FirestoreService } from './firestore.service';
import { Vehiculo } from '../../modelos/vehiculo';
import { ProxyCarburanteService } from '../../utils/proxy-carburante.service';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { firstValueFrom } from 'rxjs';
import { Place } from '../../modelos/place';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';
import { AuthStateService } from '../../utils/auth-state.service';

@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{

  constructor(private _firestore: FirestoreService, private proxy: ProxyCarburanteService,  private _geocoding: OpenRouteService, private _authState: AuthStateService) {}
  
  async calcularRuta(origen: string, destino: string, metodoMov: string) {
      const origenCoord = await new Promise<string> ((resolve) => {
        this._geocoding.searchToponimo(origen).subscribe({
          next: (response: any) => {
              const coordenadas = response.features[0].geometry.coordinates;
              resolve(`${coordenadas[0]},${coordenadas[1]}`);
          }
        });
      });

      const destinoCoord = await new Promise<string> ((resolve) => {
        this._geocoding.searchToponimo(destino).subscribe({
          next: (response: any) => {
              const coordenadas = response.features[0].geometry.coordinates;
              resolve(`${coordenadas[0]},${coordenadas[1]}`);
          }
        });
      });

      return firstValueFrom(this._geocoding.getRuta(origenCoord, destinoCoord, metodoMov));
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
    const response: any = await this._geocoding.getRouteFSE(start.getCoordenadas(), end.getCoordenadas(), movilidad, preferencia);
    return response;
}

async createRoute(nombre: string, start: Place, end: Place, movilidad: string, preferencia: string, km: number, duracion: number): Promise<Route> {
  const existPlace: boolean = await this._firestore.ifExistPlace(start);
  const existPlace2: boolean = await this._firestore.ifExistPlace(end);

  if(!existPlace || !existPlace2)
    throw new NotExistingObjectException();

  const newRoute: Route = new Route(nombre, start.getToponimo(), end.getToponimo(), preferencia, movilidad, km, duracion);
  const uid = this._authState.currentUser?.uid;

  await this._firestore.createRoute(newRoute, `ruta/${uid}/listaRutasInterés`);

  return newRoute;
}
  async deleteRoute(nombre: string): Promise<void> {
    const uid = this._authState.currentUser?.uid;
    await this._firestore.deleteRoute(`ruta/${uid}/listaRutasInterés`, nombre);
  }
}