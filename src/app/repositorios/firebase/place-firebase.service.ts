import { inject, Injectable } from '@angular/core';
import { PlaceRepository } from '../interfaces/place-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';
import { AuthStateService } from '../../utils/auth-state.service';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { openRouteService } from '../../APIs/Geocoding/openRoute.service';
import { getAuth } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlaceFirebaseService implements PlaceRepository{


  private firestore: FirestoreService = inject(FirestoreService);
  private _authState: AuthStateService = inject(AuthStateService);
  firestore: FirestoreService = inject(FirestoreService);
  geocoding: openRouteService = inject(openRouteService);


  constructor() {}

  async createPlaceC(coordenadas: number[], toponimo:string): Promise<Place> { 
    const uid = this._authState.currentUser?.uid;
    const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

    const docRef = await this.firestore.getAutoIdReference(PATHPLACE);
    const idPlace = docRef.id;


    const placeRegisterC: Place = new Place(idPlace, toponimo, coordenadas);

    await this.firestore.createPlaceC(placeRegisterC, PATHPLACE);
    return placeRegisterC;
}

    async deletePlace(idPlace: string) {
        //para sacar el usuario y meter los lugares en su colección
        const uid = this._authState.currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

        await this.firestore.deletePlace(PATHPLACE, idPlace);
    }



    async createPlaceT(toponimo: string, coordenadas:number[]): Promise<Place> { 
        const uid = this._authState.currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`;

        const docRef = await this.firestore.getAutoIdReference(PATHPLACE); // Método que retorna un `DocumentReference`
        const idPlace = docRef.id;
    

        const placeRegisterT: Place = new Place(idPlace, toponimo, coordenadas);

        await this.firestore.createPlaceT(placeRegisterT, PATHPLACE);
        return placeRegisterT;
    }

    async getPlaces(): Promise<any> {
        return await this.firestore.getPlaces();
    }
};