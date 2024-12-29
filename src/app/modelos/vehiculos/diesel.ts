import { Vehiculo } from "./vehiculo";

export class Diesel extends Vehiculo {
    constructor(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number, tipo: string){
        super(matricula, marca, modelo, año_fabricacion, consumo, tipo);
    }
}