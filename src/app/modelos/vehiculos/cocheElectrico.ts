import { Vehiculo } from "./vehiculo";

export class CocheElectrico extends Vehiculo {
    obtenerCoste(kilometros: number, precio: any) { //cambiar para eléctrico
        return parseFloat(((kilometros/100) * this.getConsumo() * precio).toFixed(2)); 
    }
    // La división km/100 se utiliza porque el consumo de los vehículos eléctricos (o de otros tipos) 
    // se suele expresar como kWh por cada 100 kilómetros (kWh/100 km). Este estándar de medición facilita 
    // comparar vehículos y calcular costos de rutas de diferentes distancias.
}