import { AuthStateService } from '../utils/auth-state.service';
import { throwError } from 'rxjs';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
import { Vehiculo } from '../modelos/vehiculo';
import { Route } from '../modelos/route';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { VehiculoFirebaseService } from '../repositorios/firebase/vehiculo-firebase.service';
import { NotExistingObjectException } from '../excepciones/notExistingObjectException';
import { FirestoreService } from '../repositorios/firebase/firestore.service';
import { Inject, Injectable, inject } from '@angular/core';


const pathRoute = 'route';

@Injectable({
  providedIn: 'root'
})

export class RouteService {
  private _authState: AuthStateService = inject(AuthStateService);
  private servicioVehículo: VehiculoFirebaseService = inject(VehiculoFirebaseService);

  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository, private _firestore: FirestoreService) { }


  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route){
    const existVehicle: boolean = await this._firestore.ifExistVehicle(vehiculo);

    if(!existVehicle)
      throw new NotExistingObjectException;

    
    if(!vehiculo || !ruta){
      throw new ObligatoryFieldsException;
    }

    const vehiculosUsuario = this.servicioVehículo.consultarVehiculo();

    for(const vehiculoU of await vehiculosUsuario) {
      if (vehiculoU.getMatricula() == vehiculo.getMatricula())
        //calcular coste ruta llamando a api
        return this.routeRepository.obtenerCosteRuta(vehiculo, ruta);
    }
    
    throw new NotExistingObjectException();
  }
}
