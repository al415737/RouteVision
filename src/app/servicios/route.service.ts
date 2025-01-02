import { Place } from '../modelos/place';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { TypeNotChosenException } from '../excepciones/type-not-chosen-exception';
import { InvalidCalculateRoute } from '../excepciones/invalid-calculate-route';
import { VehicleNotFoundException } from '../excepciones/vehicle-not-Found-Exception';
import { inject, Inject, Injectable } from '@angular/core';
import { AuthStateService } from '../utils/auth-state.service';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../repositorios/interfaces/vehiculo-repository';
import { Vehiculo } from '../modelos/vehiculos/vehiculo';
import { Route } from '../modelos/route';
import { NotExistingObjectException } from '../excepciones/notExistingObjectException';
import { NoRouteFoundException } from '../excepciones/no-route-found-exception';
import { InvalidCalculoCosteException } from '../excepciones/invalid-calculo-coste-exception';
import { IncorrectMethodException } from '../excepciones/incorrect-method-exception';


@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository, @Inject(VEHICULO_REPOSITORY_TOKEN) private servicioVehículo: VehiculoRepository) { }

  calcularRuta(origen: Place, destino: Place, metodoMov: string) {
      if(metodoMov != 'driving-car' && metodoMov != 'cycling-regular' && metodoMov != 'foot-walking' && metodoMov != 'foot-hiking'){
          throw new IncorrectMethodException();
      }

      return this.routeRepository.calcularRuta(origen, destino, metodoMov);
  }

  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route){
    const vehiculosUsuario = this.servicioVehículo.consultarVehiculo();

    for(const vehiculoU of await vehiculosUsuario) {
      if (vehiculoU.getMatricula() == vehiculo.getMatricula())
        //calcular coste ruta llamando a api
        return await this.routeRepository.obtenerCosteRuta(vehiculo, ruta);
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

  costeRutaPieBicicleta(ruta: Route, origen: Place, destino: Place){
    if(ruta.getMovilidad() != 'cycling-regular' && ruta.getMovilidad() != 'foot-walking'){
        throw new InvalidCalculoCosteException();
    }

    if(!this.consultarRutaEspecifica(ruta)){
        throw new NoRouteFoundException();
    }

    return this.routeRepository.costeRutaPieBicicleta(ruta, origen, destino);
  }

  consultarRutaEspecifica(ruta: Route){
    if(ruta.getOrigen() == '' || ruta.getOrigen() == null || ruta.getDestino() == '' || ruta.getDestino() == null || ruta.getMovilidad() == '' || ruta.getMovilidad() == null){
      throw new InvalidCalculateRoute();
    }

    return this.routeRepository.consultarRutaEspecifica(ruta);
  }

  createRoute(nombre: string, start: Place, end: Place, movilidad: string, preferencia: string, km: number, duracion: number, coste: number): Promise<Route> {
    if (!nombre.trim() && !movilidad.trim() && !preferencia.trim() && km > 0 && duracion > 0)
      throw new ObligatoryFieldsException();

    return this.routeRepository.createRoute(nombre, start, end, movilidad, preferencia, km, duracion, false, coste);
  }

  async deleteRoute(nombre: string): Promise<boolean> {
    return this.routeRepository.deleteRoute(nombre);
  }

  async getRoutes(): Promise<Route[]> {
    return this.routeRepository.getRoutes();
  }
}
