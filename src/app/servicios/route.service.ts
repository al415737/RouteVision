import { inject, Inject, Injectable } from '@angular/core'; 
import { AuthStateService } from '../utils/auth-state.service';
import { throwError } from 'rxjs';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
import { Vehiculo } from '../modelos/vehiculo';
import { Route } from '../modelos/route';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { VehiculoFirebaseService } from '../repositorios/firebase/vehiculo-firebase.service';
import { NotExistingObjectException } from '../excepciones/notExistingObjectException';


const pathRoute = 'route';

@Injectable({
  providedIn: 'root'
})

export class RouteService {
  private _authState: AuthStateService = inject(AuthStateService);
  private servicioVehículo: VehiculoFirebaseService = inject(VehiculoFirebaseService);

  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository) { }

  async obtenerRuta(vehiculo: Vehiculo, ruta: Route){
    let encontrada = false;

    if(vehiculo == null || ruta == null){
      throw new ObligatoryFieldsException;
    }

    const vehiculosUsuario = this.servicioVehículo.consultarVehiculo();

    for(const vehiculoU of await vehiculosUsuario) {
      if (vehiculoU.getMatricula() == vehiculo.getMatricula())
        encontrada = true;
        //calcular ruta
        let costeRuta = ruta.getKm();
        break;
    }

    if (encontrada == false){
      throw new NotExistingObjectException();
    }




    


  }
}

