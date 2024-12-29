import { InjectionToken } from '@angular/core';
import { Route } from '../../modelos/route';
import { Vehiculo } from '../../modelos/vehiculo';
import { Place } from '../../modelos/place';

export const ROUTE_REPOSITORY_TOKEN = new InjectionToken<RouteRepository>('RouteRepository');

export interface RouteRepository {
    calcularRuta(origen: Place, destino: Place, metodoMov: string): any;
    obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route): Promise<number>;
}
