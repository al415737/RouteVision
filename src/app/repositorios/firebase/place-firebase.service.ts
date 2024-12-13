import { inject, Injectable } from '@angular/core';
import { PlaceRepository } from '../interfaces/place-repository';
import { Place } from '../../modelos/place';
import { FirestoreService } from './firestore.service';



const PATHPLACE = 'place';

@Injectable({
  providedIn: 'root'
})
export class PlaceFirebaseService implements PlaceRepository{

  firestore: FirestoreService = inject(FirestoreService);

  constructor() { }
  
  createPlaceC(idPlace: string, coordenadas: number[]): Promise<Place> {
    throw new Error('Method not implemented.');
  }
  createPlaceT(idPlace: string, topponimo: string): Promise<Place> {
    throw new Error('Method not implemented.');
  }
  async getPlaces(): Promise<any> {
    return await this.firestore.getPlaces();
  }
  deletePlace(idPlace: string): void {
    throw new Error('Method not implemented.');
  }




}