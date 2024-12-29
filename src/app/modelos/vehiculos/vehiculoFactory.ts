import { InvalidTypeFuelException } from "../../excepciones/invalid-type-of-fuel-exception";
import { InvalidTypeVehicleException } from "../../excepciones/invalid-type-vehicle-exception";
import { Electrico } from "./electrico";
import { Gasolina } from "./gasolina";
import { Diesel } from "./diesel";
import { Vehiculo } from "./vehiculo";
import { VehiculoService } from "../../servicios/vehiculo.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})
export class VehiculoFactory{

    constructor(private servicio: VehiculoService){}

    async crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number, tipo: string): Promise<Vehiculo> {
        switch(tipo){
            case 'Gasolina':
                const gasolina = new Gasolina(matricula, marca, modelo, año_fabricacion, consumo, tipo);
                return this.servicio.crearVehiculo(gasolina);
            case 'Electrico':
                const electrico = new Electrico(matricula, marca, modelo, año_fabricacion, consumo, tipo);
                return this.servicio.crearVehiculo(electrico);
            case 'Diesel':
                const diesel = new Diesel(matricula, marca, modelo, año_fabricacion, consumo, tipo);
                return this.servicio.crearVehiculo(diesel);
            default:
                throw new InvalidTypeVehicleException();
        }
    } 
}