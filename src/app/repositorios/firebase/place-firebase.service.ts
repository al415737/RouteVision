import { inject, Injectable } from '@angular/core';
import { PlaceRepository } from '../interfaces/place-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { getAuth } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PlaceFirebaseService implements PlaceRepository{

    private toponimo: any;
    private coordenadas: any;

    firestore: FirestoreService = inject(FirestoreService);
    geocoding: OpenRouteService = inject(OpenRouteService);


    constructor() {}

    async createPlaceC(coordenadas: number[]): Promise<Place> { 
        const uid = getAuth().currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

        this.toponimo = await firstValueFrom(this.geocoding.getToponimo(coordenadas));
        let prueba = this.toponimo.features[0].properties.name;

        const docRef = await this.firestore.getAutoIdReference(PATHPLACE);
        const idPlace = docRef.id;


        const placeRegisterC: Place = new Place(idPlace, prueba, coordenadas);

        await this.firestore.createPlaceC(placeRegisterC, PATHPLACE);
        return placeRegisterC;
    }

    async deletePlace(idPlace: string) {
        //para sacar el usuario y meter los lugares en su colección
        const uid = getAuth().currentUser?.uid; 
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

        await this.firestore.deletePlace(PATHPLACE, idPlace);
    }



    async createPlaceT(toponimo: string): Promise<Place> { 
        const uid = getAuth().currentUser?.uid;
        const PATHPLACE = `Lugar/${uid}/listaLugaresInterés`

        
            // Usar promesa para obtener coordenadas en lugar de suscribirse directamente
            this.coordenadas = await new Promise((resolve, reject) => {
                this.geocoding.getCoordenadas(toponimo).subscribe({
                    next: (response: any) => {
                        if (!response.features || response.features.length === 0) {
                            reject(new InvalidPlaceException());
                        } else {
                            resolve(response.features[0].geometry.coordinates);
                        }
                    },
                });
            });
        

        const docRef = await this.firestore.getAutoIdReference(PATHPLACE); // Método que retorna un `DocumentReference`
        const idPlace = docRef.id;


        const placeRegisterT: Place = new Place(idPlace, toponimo, this.coordenadas);

        await this.firestore.createPlaceT(placeRegisterT, PATHPLACE);
        return placeRegisterT;
    }

    async getPlaces(): Promise<any> {
        return await this.firestore.getPlaces();
    }
};