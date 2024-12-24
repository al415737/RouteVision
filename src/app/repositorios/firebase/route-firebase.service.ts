import { Injectable } from '@angular/core';
import { RouteRepository } from '../interfaces/route-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';


@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{

    constructor(private _firestore: FirestoreService, private _geocoding: OpenRouteService) {}

    async getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any> {
        const existPlace: boolean = await this._firestore.ifExistPlace(start);
        const existPlace2: boolean = await this._firestore.ifExistPlace(end);

        if(!existPlace || !existPlace2)
            return [];

        const response: any = await this._geocoding.getRouteFSE(start.getCoordenadas(), end.getCoordenadas(), movilidad, preferencia);
        return response;
    }

}