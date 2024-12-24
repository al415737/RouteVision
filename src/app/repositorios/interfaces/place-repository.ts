import { InjectionToken } from '@angular/core';
import { Place } from '../../modelos/place';

export const PLACE_REPOSITORY_TOKEN = new InjectionToken<PlaceRepository>('PlaceRepository');

export interface PlaceRepository {
    createPlaceC(coordenadas: number[], toponimo:string): Promise<Place>;
    createPlaceT(toponimo: string, coordenadas: number[]): Promise<Place>;
    getPlaces(): Promise<any>;
    deletePlace(idPlace: string): Promise<void>;
}
