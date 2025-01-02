import { NotAvailableFuelException } from "../../excepciones/not-available-fuel-exception";
import { Vehiculo } from "./vehiculo";

export class CocheGasolina extends Vehiculo {
    obtenerCoste(kilometros: number, precio: any) {
        if (!precio) {
            throw new NotAvailableFuelException();
        }
        const precioNum = parseFloat(precio.replace(',', '.'));
        return parseFloat((kilometros / 100 * this.getConsumo() * precioNum).toFixed(2)); 
    }
}