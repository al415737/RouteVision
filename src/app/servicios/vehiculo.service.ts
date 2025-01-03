import { Inject, Injectable } from '@angular/core';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../repositorios/interfaces/vehiculo-repository';
import { NullLicenseException } from '../excepciones/null-license-exception';
import { Vehiculo } from '../modelos/vehiculos/vehiculo';
import { VehiculoEnum } from '../modelos/vehiculos/enumVehiculo';

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

    let vehiculo: Vehiculo = VehiculoEnum.crearVehiculo(tipo, matricula, marca, modelo, año_fabricacion, consumo);
    return this.vehiRepo.crearVehiculo(vehiculo);
  }

  actualizarVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number, tipo: string, favorito:boolean){
    if(matricula == '' || matricula == null){
      throw new NullLicenseException();
    }

    let vehiculo: Vehiculo = VehiculoEnum.crearVehiculo(tipo, matricula, marca, modelo, año_fabricacion, consumo);
    return this.vehiRepo.actualizarVehiculo(vehiculo);
  }

  async consultarVehiculo(){
    return this.vehiRepo.consultarVehiculo();
  }

  getVehiculo(matricula:string){
    return this.vehiRepo.getVehiculo(matricula);
  }

  async eliminarVehiculo(matricula: string):Promise<void>{
    await this.vehiRepo.eliminarVehiculo(matricula);
  }

  async marcarFavorito(vehiculo: Vehiculo, favorito: boolean){
      return await this.vehiRepo.marcarFavorito(vehiculo, favorito);
  }

}
