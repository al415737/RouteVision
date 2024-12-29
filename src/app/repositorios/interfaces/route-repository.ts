import { InjectionToken } from '@angular/core';
import { Route } from '../../modelos/route';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { Place } from '../../modelos/place';

export const ROUTE_REPOSITORY_TOKEN = new InjectionToken<RouteRepository>('RouteRepository');

export interface RouteRepository {
    getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any>;
    calcularRuta(origen: Place, destino: Place, metodoMov: string): any;
    obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route): Promise<number>;
    costeRutaPieBicicleta(ruta: Route, origen: Place, destino: Place): any;
    consultarRutaEspecifica(ruta: Route): Promise<boolean>;
    createRoute(nombre: string, start: Place, end: Place, movilidad: string, preferencia: string, km: number, duracion: number): Promise<Route>;
    deleteRoute(nombre: string): Promise<void>;
    getRoutes(): Promise<Route[]>;
}
