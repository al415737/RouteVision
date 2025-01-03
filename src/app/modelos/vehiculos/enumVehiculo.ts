import { CocheElectrico } from './cocheElectrico';
import { CocheGasolina } from './cocheGasolina';
import { CocheDiesel } from './cocheDiesel';
import { Vehiculo } from './vehiculo';

export enum TipoVehiculo {
    ELECTRICO = "Electrico",
    GASOLINA = "Gasolina",
    DIESEL = "Diesel"
}

export class VehiculoEnum {
    static crearVehiculo(
        tipo: string, // Aceptamos una string como tipo
        matricula: string,
        marca: string,
        modelo: string,
        ano_fabricacion: string,
        consumo: number
    ): Vehiculo {
        switch (tipo) { // Comparamos directamente con los valores exactos del enum
            case TipoVehiculo.ELECTRICO:
                return new CocheElectrico(matricula, marca, modelo, ano_fabricacion, consumo, TipoVehiculo.ELECTRICO);
            case TipoVehiculo.GASOLINA:
                return new CocheGasolina(matricula, marca, modelo, ano_fabricacion, consumo, TipoVehiculo.GASOLINA);
            case TipoVehiculo.DIESEL:
                return new CocheDiesel(matricula, marca, modelo, ano_fabricacion, consumo, TipoVehiculo.DIESEL);
            default:
                throw new Error(`Tipo de vehículo no soportado: ${tipo}`);
        }
    }
}
