
import { Inject, Injectable } from '@angular/core';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../repositorios/interfaces/vehiculo-repository';
import { NullLicenseException } from '../excepciones/null-license-exception';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(@Inject(VEHICULO_REPOSITORY_TOKEN) private vehiRepo: VehiculoRepository) { 
  }

  crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number, tipoCombustible: string){
    if(matricula == '' || matricula == null){
      throw new NullLicenseException();
    }
    return this.vehiRepo.crearVehiculo(matricula, marca, modelo, año_fabricacion, consumo, tipoCombustible);
  }

  consultarVehiculo(){
    return this.vehiRepo.consultarVehiculo();
  }

  eliminarVehiculo(matricula: string){
    return this.vehiRepo.eliminarVehiculo(matricula);
  }
}
