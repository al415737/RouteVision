
import { Inject, Injectable } from '@angular/core';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../repositorios/interfaces/vehiculo-repository';
import { NullLicenseException } from '../excepciones/null-license-exception';
import { Vehiculo } from '../modelos/vehiculos/vehiculo';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(@Inject(VEHICULO_REPOSITORY_TOKEN) private vehiRepo: VehiculoRepository) { 
  }

  crearVehiculo(vehiculo: Vehiculo){
    if(vehiculo.getMatricula() == '' || vehiculo.getMatricula() == null){
      throw new NullLicenseException();
    }
    return this.vehiRepo.crearVehiculo(vehiculo);
  }

  consultarVehiculo(){
    return this.vehiRepo.consultarVehiculo();
  }

  eliminarVehiculo(matricula: string){
    return this.vehiRepo.eliminarVehiculo(matricula);
  }
}
