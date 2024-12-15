import { InjectionToken } from '@angular/core';
import { Place } from '../../modelos/place';

export const PLACE_REPOSITORY_TOKEN = new InjectionToken<PlaceRepository>('PlaceRepository');

export interface PlaceRepository {
    createPlaceC(idPlace: string, coordenadas: number[]): Promise<Place>;
    
    deletePlace(idPlace: string): void;
}