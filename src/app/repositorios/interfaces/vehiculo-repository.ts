import { InjectionToken } from '@angular/core';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';

export const VEHICULO_REPOSITORY_TOKEN = new InjectionToken<VehiculoRepository>('VehiculoRepository');

export interface VehiculoRepository {
    crearVehiculo(vehiculo: Vehiculo): Promise<Vehiculo>;
    consultarVehiculo(): Promise<any>;
    getVehiculo(matricula:string): Promise<any>
    actualizarVehiculo(vehiculo:Vehiculo): Promise<any>;
    eliminarVehiculo(matricula: string): Promise<void>;
    marcarFavorito(vehiculo: Vehiculo): Promise<any>;
}