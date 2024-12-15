import { Injectable } from '@angular/core'; 
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { Place } from '../modelos/place';

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  constructor() { }

  createPlaceC(idPlace: string, coordenadas: number[]){
    return null;
  } 

  deletePlace(idPlace: string){
    return null;
  }
}