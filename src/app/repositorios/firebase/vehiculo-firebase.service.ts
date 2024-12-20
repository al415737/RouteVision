import { inject, Injectable } from '@angular/core';
import { VehiculoRepository } from '../interfaces/vehiculo-repository';
import { Vehiculo } from '../../modelos/vehiculo';
import { FirestoreService } from './firestore.service';
import { NullLicenseException } from '../../excepciones/null-license-exception';


const PATHVEHICULO = 'vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoFirebaseService implements VehiculoRepository{

  firestore: FirestoreService = inject(FirestoreService);

  constructor() { }

    async crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number): Promise<Vehiculo> {
        if(matricula == '' || matricula == null){
            throw new NullLicenseException();
        }

        const vehRegister: Vehiculo = new Vehiculo(matricula, marca, modelo, año_fabricacion, consumo);

        await this.firestore.createVehiculo(vehRegister, PATHVEHICULO);
        return vehRegister;
    }

    async consultarVehiculo() {
        return await this.firestore.consultarVehiculo(PATHVEHICULO);
    }

    async eliminarVehiculo(matricula: string) {
        const id = await this.firestore.get('matricula', matricula, PATHVEHICULO); 
        await this.firestore.eliminarVehiculo(PATHVEHICULO, id);
    }


}