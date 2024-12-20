import { InjectionToken } from '@angular/core';
import { Place } from '../../modelos/place';

export const PLACE_REPOSITORY_TOKEN = new InjectionToken<PlaceRepository>('PlaceRepository');

export interface PlaceRepository {
    createPlaceC(coordenadas: number[]): Promise<Place>;
    createPlaceT(toponimo: string): Promise<Place>;
    deletePlace(idPlace: string): Promise<void>;
}