import { inject, Injectable } from '@angular/core';
import { VehiculoRepository } from '../interfaces/vehiculo-repository';
import { Vehiculo } from '../../modelos/vehiculo';
import { FirestoreService } from './firestore.service';


const PATHVEHICULO = 'vehiculoPATH';

@Injectable({
  providedIn: 'root'
})
export class VehiculoFirebaseService implements VehiculoRepository{

  _firestore: FirestoreService = inject(FirestoreService);

  constructor() { }

    async crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: string): Promise<Vehiculo> {
        const vehRegister: Vehiculo = new Vehiculo(matricula, marca, modelo, año_fabricacion, consumo);

        this._firestore.createVehiculo(vehRegister, PATHVEHICULO);
        return vehRegister;
    }
    async eliminarVehiculo(matricula: string) {
        // Por implementar
    }


}