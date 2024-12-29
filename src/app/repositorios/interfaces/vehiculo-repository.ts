import { InjectionToken } from '@angular/core';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';

export const VEHICULO_REPOSITORY_TOKEN = new InjectionToken<VehiculoRepository>('VehiculoRepository');

export interface VehiculoRepository {
    crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number): Promise<Vehiculo>;
    consultarVehiculo(): Promise<any>;
    eliminarVehiculo(matricula: string): void;
}