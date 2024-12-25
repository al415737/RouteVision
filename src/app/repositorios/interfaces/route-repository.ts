import { InjectionToken } from '@angular/core';
import { Route } from '../../modelos/route';
import { Vehiculo } from '../../modelos/vehiculo';
import { Place } from '../../modelos/place';

export const ROUTE_REPOSITORY_TOKEN = new InjectionToken<RouteRepository>('RouteRepository');

export interface RouteRepository {
    getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any>;
    calcularRuta(origen: string, destino: string, metodoMov: string): any;
    obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route): Promise<number>;
    costeRutaPieBicicleta(metodo: string, origen: string, destino: string): any;
    consultarRutas(): Promise<any>;
}
