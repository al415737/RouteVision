import { inject, Injectable } from '@angular/core';
import { PlaceRepository } from '../interfaces/place-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';
import { GeocodingService } from '../../APIs/Geocoding/geocoding.service';
import { subscribe } from 'firebase/data-connect';


const PATHPLACE = 'place';

@Injectable({
  providedIn: 'root'
})
export class PlaceFirebaseService implements PlaceRepository{

  firestore: FirestoreService = inject(FirestoreService);
  geocoding: GeocodingService = inject(GeocodingService);

  private toponimo: any;

  constructor() { }

    async createPlaceC(idPlace: string, coordenadas: number[]): Promise<Place> {
        //latitud - coordenadas[0] --> [-90 y +90]
        //longitud - coordenadas[1] --> [-180 y +180]
        if(coordenadas[0] < -90 || coordenadas[0] > 90){
            throw new InvalidCoordenatesException();
        }

        //suscribirse a api geocoding
        this.geocoding.getToponimo(coordenadas).subscribe{
            (respone: any) => {
                this.toponimo = respone;    
            }
        }

        const placeRegisterC: Place = new Place(idPlace, this.toponimo, coordenadas);

        await this.firestore.createPlaceC(placeRegisterC, PATHPLACE);
        return placeRegisterC;
    }

    async deletePlace(idPlace: string) {
        const id = await this.firestore.get('idPlace', idPlace, PATHPLACE); 
        await this.firestore.deletePlace(PATHPLACE, id);
    }
}