import { InjectionToken } from '@angular/core';
import { Place } from '../../modelos/place';

export const ROUTE_REPOSITORY_TOKEN = new InjectionToken<RouteRepository>('RouteRepository');

export interface RouteRepository {
    getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any>;
}