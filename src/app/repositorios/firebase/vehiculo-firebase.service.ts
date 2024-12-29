import { inject, Injectable } from '@angular/core';
import { VehiculoRepository } from '../interfaces/vehiculo-repository';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { FirestoreService } from './firestore.service';
import { getAuth } from 'firebase/auth';
import { NullLicenseException } from '../../excepciones/null-license-exception';

@Injectable({
  providedIn: 'root'
})
export class VehiculoFirebaseService implements VehiculoRepository{

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

    async eliminarVehiculo(matricula: string) {
        const uid = getAuth().currentUser?.uid;
        const PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;
        const id = await this.firestore.get('matricula', matricula, PATHVEHICULO); 
        await this.firestore.eliminarVehiculo(PATHVEHICULO, id);
    }


}