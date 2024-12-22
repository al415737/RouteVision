import { InjectionToken } from '@angular/core';
import { Route } from '@angular/router';
import { Vehiculo } from '../../modelos/vehiculo';

export const ROUTE_REPOSITORY_TOKEN = new InjectionToken<RouteRepository>('RouteRepository');

export interface RouteRepository {
    obtenerRuta(vehiculo: Vehiculo, ruta: Route): Promise<Route>;
}
