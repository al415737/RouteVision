import { Vehiculo } from "./vehiculo";

export class CocheElectrico extends Vehiculo {
    constructor(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number){
        super(matricula, marca, modelo, año_fabricacion, consumo, 'eléctrico');
    }
}