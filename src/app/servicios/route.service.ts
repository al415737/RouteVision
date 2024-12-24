import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
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
  private _authState: AuthStateService = inject(AuthStateService);

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

}
