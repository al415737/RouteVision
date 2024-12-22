import { InjectionToken } from '@angular/core';
import { Route } from '@angular/router';

export const ROUTE_REPOSITORY_TOKEN = new InjectionToken<RouteRepository>('RouteRepository');

export interface RouteRepository {
}
