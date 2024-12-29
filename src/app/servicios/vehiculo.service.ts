
import { Inject, Injectable } from '@angular/core';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../repositorios/interfaces/vehiculo-repository';
import { NullLicenseException } from '../excepciones/null-license-exception';
import { Vehiculo } from '../modelos/vehiculos/vehiculo';
import { CocheGasolina } from '../modelos/vehiculos/cocheGasolina';
import { CocheElectrico } from '../modelos/vehiculos/cocheElectrico';
import { CocheDiesel } from '../modelos/vehiculos/cocheDiesel';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(@Inject(VEHICULO_REPOSITORY_TOKEN) private vehiRepo: VehiculoRepository) { 
  }

  crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number, tipo: string){
    if(matricula == '' || matricula == null){
      throw new NullLicenseException();
    }

    let vehiculo: Vehiculo;

    if(tipo == 'Precio Gasolina 95 E5' || tipo == 'Precio Gasolina 98 E5'){
        vehiculo = new CocheGasolina(matricula, marca, modelo, año_fabricacion, consumo, tipo);
    } else if(tipo == 'Precio Gasoleo A' || tipo == 'Precio Gasoleo B'){
        vehiculo = new CocheDiesel(matricula, marca, modelo, año_fabricacion, consumo, tipo);
    } else {
        vehiculo = new CocheElectrico(matricula, marca, modelo, año_fabricacion, consumo, tipo);
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
