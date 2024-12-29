import { Vehiculo } from "./vehiculo";

export class CocheGasolina extends Vehiculo {
    constructor(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number, tipoCombustible: string){
        super(matricula, marca, modelo, año_fabricacion, consumo, tipoCombustible);
    }
}