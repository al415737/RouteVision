import { Vehiculo } from "./vehiculo";

export class CocheElectrico extends Vehiculo {
    obtenerCoste(kilometros: number, precio: any) { //cambiar para eléctrico
        const precioNum = parseFloat(precio[this.getTipo()].replace(',', '.'));
        return parseFloat((kilometros / this.getConsumo() * precioNum).toFixed(2)); 
    }

}