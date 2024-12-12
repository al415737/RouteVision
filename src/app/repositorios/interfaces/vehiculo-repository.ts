import { InjectionToken } from '@angular/core';
import { Vehiculo } from '../../modelos/vehiculo';

export const VEHICULO_REPOSITORY_TOKEN = new InjectionToken<VehiculoRepository>('VehiculoRepository');

export interface VehiculoRepository {
    crearVehiculo(matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number): Promise<Vehiculo>;
    consultarVehiculo(matricula: string): ;
    eliminarVehiculo(matricula: string): void;
}