import { inject, Injectable } from '@angular/core';
import { PlaceRepository } from '../interfaces/place-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';


const PATHPLACE = 'place';

@Injectable({
  providedIn: 'root'
})
export class PlaceFirebaseService implements PlaceRepository{

  firestore: FirestoreService = inject(FirestoreService);

  constructor() { }

    async createPlaceC(idPlace: string, coordenadas: number[]): Promise<Place> {
        //latitud - coordenadas[0] --> [-90 y +90]
        //longitud - coordenadas[1] --> [-180 y +180]
        if(coordenadas[0] < -90 || coordenadas[0] > 90){
            throw new InvalidCoordenatesException();
        }

        const placeRegisterT: Place = new Place(idPlace, toponimo, coordenadas);

        await this.firestore.createPlaceC(placeRegisterT, PATHPLACE);
        return placeRegisterT;
    }

    async createPlaceT(idPlace: string, topponimo: string): Promise<Place> {
        if(){   //COMO HAGO PARA SABER 
            throw new InvalidPlaceException();
        }

        const placeRegisterT: Place = new Place(idPlace, toponimo, coordenadas);

        await this.firestore.createPlaceT(placeRegisterT, PATHPLACE);
        return placeRegisterT;
    }

    async deletePlace(idPlace: string) {
        const id = await this.firestore.get('idPlace', idPlace, PATHPLACE); 
        await this.firestore.deletePlace(PATHPLACE, id);
    }


}