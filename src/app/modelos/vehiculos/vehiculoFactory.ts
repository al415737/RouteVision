import { InvalidTypeFuelException } from "../../excepciones/invalid-type-of-fuel-exception";
import { InvalidTypeVehicleException } from "../../excepciones/invalid-type-vehicle-exception";
import { CocheElectrico } from "./cocheElectrico";
import { CocheGasolina } from "./cocheGasolina";
import { Moto } from "./moto";
import { Vehiculo } from "./vehiculo";

export class VehiculoFactory{
    static crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number, tipo: string, combustible: string): Vehiculo {
        switch(tipo){
            case 'CocheGasolina':
                if(combustible != '95' && combustible != '98'){
                    throw new InvalidTypeFuelException();
                }
                return new CocheGasolina(matricula, marca, modelo, año_fabricacion, consumo, combustible);
            case 'CocheElectrico':
                return new CocheElectrico(matricula, marca, modelo, año_fabricacion, consumo);
            case 'Moto':
                if(combustible != '95' && combustible != '98'){
                    throw new InvalidTypeFuelException();
                }
                return new Moto(matricula, marca, modelo, año_fabricacion, consumo, combustible);
            default:
                throw new InvalidTypeVehicleException();
        }
    } 
}