import { Place } from '../modelos/place';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { TypeNotChosenException } from '../excepciones/type-not-chosen-exception';
import { InvalidCalculateRoute } from '../excepciones/invalid-calculate-route';
import { VehicleNotFoundException } from '../excepciones/vehicle-not-Found-Exception';
import { inject, Inject, Injectable } from '@angular/core';
import { AuthStateService } from '../utils/auth-state.service';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../repositorios/interfaces/vehiculo-repository';
import { Vehiculo } from '../modelos/vehiculo';
import { Route } from '../modelos/route';
import { NotExistingObjectException } from '../excepciones/notExistingObjectException';


@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository, @Inject(VEHICULO_REPOSITORY_TOKEN) private servicioVehículo: VehiculoRepository) { }

  calcularRuta(origen: string, destino: string, metodoMov: string) {
      if(origen == '' || origen == null || destino == '' || destino == null || metodoMov == '' || metodoMov == null){
          throw new InvalidCalculateRoute();
      }

      if(metodoMov != 'driving-car' && metodoMov != 'cycling' && metodoMov != 'foot-walking' && metodoMov != 'foot-hiking'){
          throw new VehicleNotFoundException();
      }

      return this.routeRepository.calcularRuta(origen, destino, metodoMov);
  }

  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route){
    const vehiculosUsuario = this.servicioVehículo.consultarVehiculo();

    for(const vehiculoU of await vehiculosUsuario) {
      if (vehiculoU.getMatricula() == vehiculo.getMatricula())
        //calcular coste ruta llamando a api
        return this.routeRepository.obtenerCosteRuta(vehiculo, ruta);
    }

    throw new NotExistingObjectException();
  }

  // Conseguir una ruta rápida, corta o económica
  getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any> {
    if (!preferencia.trim())
      throw new TypeNotChosenException();

    if (!movilidad.trim() || !preferencia.trim())
      throw new ObligatoryFieldsException();

    return this.routeRepository.getRouteFSE(start, end, movilidad, preferencia);
  }

  createRoute(nombre: string, start: Place, end: Place, movilidad: string, preferencia: string, km: number, duracion: number): Promise<Route> {
    if (!nombre.trim() && !movilidad.trim() && !preferencia.trim() && km > 0 && duracion > 0)
      throw new ObligatoryFieldsException();

    return this.routeRepository.createRoute(nombre, start, end, movilidad, preferencia, km, duracion);
  }

  async deleteRoute(nombre: string): Promise<void> {
    this.routeRepository.deleteRoute(nombre);
  }

  async getRoutes(): Promise<any> {
    return null;
  }
}
