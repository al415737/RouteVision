import { inject, Injectable } from '@angular/core';
import { VehiculoRepository } from '../interfaces/vehiculo-repository';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { FirestoreService } from './firestore.service';
import { getAuth } from 'firebase/auth';
import { VehicleNotFoundException } from '../../excepciones/vehicle-not-Found-Exception';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';
import { AuthStateService } from '../../utils/auth-state.service';
import { NoElementsException } from '../../excepciones/no-Elements-exception';

@Injectable({
  providedIn: 'root'
})
export class VehiculoFirebaseService implements VehiculoRepository{
  private _authState: AuthStateService = inject(AuthStateService);

    firestore: FirestoreService = inject(FirestoreService);

  constructor() { 
  }

    async crearVehiculo(vehiculo: Vehiculo): Promise<Vehiculo> {
        const uid = getAuth().currentUser?.uid;
        const PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;

        await this.firestore.createVehiculo(vehiculo, PATHVEHICULO);
        return vehiculo;
    }

    async consultarVehiculo() {
        const uid = getAuth().currentUser?.uid;
        const PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;
        return await this.firestore.consultarVehiculo(PATHVEHICULO);
    }

    async actualizarVehiculo(vehiculo: Vehiculo): Promise<any> {
      const id = await this.firestore.get('matricula', vehiculo.getMatricula(), `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos`);
      if (id == '') {
        throw new NoElementsException();
      }
      return await this.firestore.actualizarVehiculo(vehiculo, id);
    }

    async eliminarVehiculo(matricula: string):Promise<void> {
        const uid = getAuth().currentUser?.uid;
        const PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;
        const id = await this.firestore.get('matricula', matricula, PATHVEHICULO); 

        if (!id) {
          throw new VehicleNotFoundException(); // Lanza una excepción si no se encuentra el vehículo
        }

        await this.firestore.eliminarVehiculo(PATHVEHICULO, id);
    }

    async marcarFavorito(vehiculo: Vehiculo): Promise<any> {
        vehiculo.setFavorito(true);
        await this.actualizarVehiculo(vehiculo);
    }


}