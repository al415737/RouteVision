import { InjectionToken } from '@angular/core';
import { Place } from '../../modelos/place';

export const PLACE_REPOSITORY_TOKEN = new InjectionToken<PlaceRepository>('PlaceRepository');

export interface PlaceRepository {
    createPlaceC(coordenadas: number[]): Promise<Place>;
    createPlaceT(toponimo: string): Promise<Place>;
    deletePlace(idPlace: string): Promise<void>;
}
import { InjectionToken } from '@angular/core';
import { Place } from '../../modelos/place';

export const PLACE_REPOSITORY_TOKEN = new InjectionToken<PlaceRepository>('PlaceRepository');

export interface PlaceRepository {
    createPlaceC(idPlace: string, coordenadas: number[]): Promise<Place>;
    createPlaceT(idPlace: string, topponimo: string): Promise<Place>;
    getPlaces(): Promise<any>;
    deletePlace(idPlace: string): void;
}