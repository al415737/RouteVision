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
  geocoding: openRouteService = inject(openRouteService);
  private coordenadas: number[] = [];
  private toponimo: any ;

  constructor() {}

  async createPlaceC(coordenadas: number[]): Promise<Place> { 
    const uid = this._authState.currentUser?.uid;
    const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`;

    this.toponimo = await firstValueFrom(this.geocoding.searchCoordenadas(coordenadas[0],coordenadas[1]));
    let lugar = this.toponimo.features[0].properties.name;

    const docRef = await this.firestore.getAutoIdReference(PATHPLACE);
    const idPlace = docRef.id;


    const placeRegisterC: Place = new Place(idPlace, lugar, coordenadas);

    await this.firestore.createPlaceC(placeRegisterC, PATHPLACE);
    return placeRegisterC;
}

    async deletePlace(idPlace: string) {
        const uid = this._authState.currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

        await this.firestore.deletePlace(PATHPLACE, idPlace);
    }



    async createPlaceT(toponimo: string): Promise<Place> { 
        const uid = this._authState.currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`;

        this.coordenadas = await new Promise((resolve, reject) => {
            this.geocoding.searchToponimo(toponimo).subscribe({
                next: (response: any) => {
                    if (!response.features || response.features.length === 0) {
                        reject(new InvalidPlaceException());
                    } else {
                        resolve(response.features[0].geometry.coordinates);
                    }
                },
            });
        });

        const docRef = await this.firestore.getAutoIdReference(PATHPLACE);
        const idPlace = docRef.id;
    

        const placeRegisterT: Place = new Place(idPlace, toponimo, this.coordenadas);

        await this.firestore.createPlaceT(placeRegisterT, PATHPLACE);
        return placeRegisterT;
    }

    async getPlaces(): Promise<any> {
        return await this.firestore.getPlaces();
    }
};