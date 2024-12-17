import { inject, Injectable } from '@angular/core';
import { PlaceRepository } from '../interfaces/place-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';
import { GeocodingService } from '../../APIs/Geocoding/geocoding.service';
import { subscribe } from 'firebase/data-connect';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class PlaceFirebaseService implements PlaceRepository{

  private toponimo: any;

  firestore: FirestoreService = inject(FirestoreService);
  geocoding: GeocodingService = inject(GeocodingService);


  constructor() {}

    async createPlaceC(coordenadas: number[]): Promise<Place> { 
        const uid = getAuth().currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

        this.geocoding.getToponimo(coordenadas).subscribe(
            (respone: any) => {
                this.toponimo = respone;    
            },
        );

        const docRef = await this.firestore.getAutoIdReference(PATHPLACE); // Método que retorna un `DocumentReference`
        const idPlace = docRef.id;
    

        const placeRegisterC: Place = new Place(idPlace, this.toponimo, coordenadas);

        await this.firestore.createPlaceC(placeRegisterC, PATHPLACE);
        return placeRegisterC;
    }

    async deletePlace(idPlace: string) {
        //para sacar el usuario y meter los lugares en su colección
        const uid = getAuth().currentUser?.uid; 
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

        await this.firestore.deletePlace(PATHPLACE, idPlace);
    }
}