import { InjectionToken } from '@angular/core';
import { Route } from '../../modelos/route';
import { Vehiculo } from '../../modelos/vehiculo';

export const ROUTE_REPOSITORY_TOKEN = new InjectionToken<RouteRepository>('RouteRepository');

export interface RouteRepository {
    calcularRuta(origen: string, destino: string, metodoMov: string): any;
    obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route): Promise<number>;
}
