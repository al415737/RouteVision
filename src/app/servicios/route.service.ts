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
import { NoRouteFoundException } from '../excepciones/no-route-found-exception';


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

  costeRutaPieBicicleta(metodo: string){
    if(metodo != 'Bicicleta' && metodo != 'pie'){
        throw new NoRouteFoundException();
    }

    return this.routeRepository.costeRutaPieBicicleta(metodo);
  }

}
