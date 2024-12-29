import { Vehiculo } from "./vehiculo";

export class CocheDiesel extends Vehiculo {
    obtenerCoste(kilometros: number, precio: any) {
        const precioNum = parseFloat(precio[this.getTipo()].replace(',', '.'));
        return parseFloat((kilometros / 100 * this.getConsumo() * precioNum).toFixed(2)); 
    }

}