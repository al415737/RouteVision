import { inject, Injectable } from '@angular/core';
import { VehiculoRepository } from '../interfaces/vehiculo-repository';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { FirestoreService } from './firestore.service';
import { getAuth } from 'firebase/auth';
import { VehicleNotFoundException } from '../../excepciones/vehicle-not-Found-Exception';
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

        await this.firestore.create(vehiculo.getMatricula(), vehiculo, PATHVEHICULO);
        return vehiculo;
    }

    async consultarVehiculo() {
        const uid = getAuth().currentUser?.uid;
        const PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;
        return await this.firestore.getValues(PATHVEHICULO);
    }

    async getVehiculo(matricula: string): Promise<any> {
      const uid = getAuth().currentUser?.uid;
      const PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;
      const id = await this.firestore.get('matricula', matricula, PATHVEHICULO);
      return await this.firestore.getValue(id, PATHVEHICULO);
    }

    async actualizarVehiculo(vehiculo: Vehiculo): Promise<any> {
      const id = await this.firestore.get('matricula', vehiculo.getMatricula(), `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos`);
      if (id == '') {
        throw new NoElementsException();
      }

      const PATH = `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos/${id}`;
      return await this.firestore.edit(vehiculo, PATH);
    }

    async eliminarVehiculo(matricula: string):Promise<void> {
        const uid = getAuth().currentUser?.uid;
        const PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;
        const id = await this.firestore.get('matricula', matricula, PATHVEHICULO); 

        if (!id) {
          throw new VehicleNotFoundException(); // Lanza una excepción si no se encuentra el vehículo
        }

        await this.firestore.delete(PATHVEHICULO, id);
    }

    async marcarFavorito(vehiculo: Vehiculo, favorito: boolean): Promise<any> {
        vehiculo.setFavorito(favorito);
        return await this.actualizarVehiculo(vehiculo);
    }


}