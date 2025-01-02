import { inject, Injectable } from '@angular/core';
import { PlaceRepository } from '../interfaces/place-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { getAuth } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { AuthStateService } from '../../utils/auth-state.service';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';

@Injectable({
  providedIn: 'root'
})

export class PlaceFirebaseService implements PlaceRepository{
  private firestore: FirestoreService = inject(FirestoreService);
  private _authState: AuthStateService = inject(AuthStateService);
  geocoding: OpenRouteService = inject(OpenRouteService);
  private coordenadas: number[] = [];
  private toponimo: any ;

  constructor() {}

  async createPlaceC(coordenadas: number[]): Promise<Place> { 
    const uid = this._authState.currentUser?.uid;
    const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`;

    this.toponimo = await firstValueFrom(this.geocoding.searchCoordenadas(coordenadas[0],coordenadas[1]));
    let lugar = this.toponimo.features[0].properties.name;
    let municipio = this.toponimo.features[0].properties.region;

    const docRef = await this.firestore.getAutoIdReference(PATHPLACE);
    const idPlace = docRef.id;


    const placeRegisterC: Place = new Place(idPlace, lugar, [coordenadas[1], coordenadas[0]], false, municipio);

    await this.firestore.createPlaceC(placeRegisterC, PATHPLACE);
    return placeRegisterC;
    }

    async deletePlace(idPlace: string): Promise<boolean> {
        const uid = this._authState.currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`;
        const exist: string = await this.firestore.get('idPlace', idPlace, PATHPLACE);

        if (exist == '')
            throw new NotExistingObjectException();

        await this.firestore.deletePlace(PATHPLACE, idPlace);
        return true;
    }



    async createPlaceT(toponimo: string): Promise<Place> { 
        const uid = this._authState.currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`;
        let municipio: string = '';

        this.coordenadas = await new Promise((resolve, reject) => {
            this.geocoding.searchToponimo(toponimo).subscribe({
                next: (response: any) => {
                    if (!response.features || response.features.length === 0) {
                        reject(new InvalidPlaceException());
                    } else {
                        municipio = response.features[0].properties.region;
                        resolve(response.features[0].geometry.coordinates);
                    }
                },
            });
        });

        const docRef = await this.firestore.getAutoIdReference(PATHPLACE);
        const idPlace = docRef.id;


        const placeRegisterT: Place = new Place(idPlace, toponimo, this.coordenadas, false, municipio);

        await this.firestore.createPlaceT(placeRegisterT, PATHPLACE);
        return placeRegisterT;
    }

    async getPlaces(): Promise<any> {
        return await this.firestore.getPlaces();
    }
};