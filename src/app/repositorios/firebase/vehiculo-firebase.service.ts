import { inject, Injectable } from '@angular/core';
import { VehiculoRepository } from '../interfaces/vehiculo-repository';
import { Vehiculo } from '../../modelos/vehiculo';
import { FirestoreService } from './firestore.service';
import { getAuth } from 'firebase/auth';
import { NullLicenseException } from '../../excepciones/null-license-exception';

@Injectable({
  providedIn: 'root'
})
export class VehiculoFirebaseService implements VehiculoRepository{

    private PATHVEHICULO: string;

    firestore: FirestoreService = inject(FirestoreService);

  constructor() { 
        const uid = getAuth().currentUser?.uid;
        this.PATHVEHICULO = `vehiculo/${uid}/listaVehiculos`;
  }

    async crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number): Promise<Vehiculo> {
        const vehRegister: Vehiculo = new Vehiculo(matricula, marca, modelo, año_fabricacion, consumo);

        await this.firestore.createVehiculo(vehRegister, this.PATHVEHICULO);
        return vehRegister;
    }

    async consultarVehiculo() {
        return await this.firestore.consultarVehiculo(this.PATHVEHICULO);
    }

    async eliminarVehiculo(matricula: string) {
        
        const id = await this.firestore.get('matricula', matricula, this.PATHVEHICULO); 
        await this.firestore.eliminarVehiculo(this.PATHVEHICULO, id);
    }


}