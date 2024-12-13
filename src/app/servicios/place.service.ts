import { Inject, Injectable } from '@angular/core'; 
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { PlaceRepository, PLACE_REPOSITORY_TOKEN } from '../repositorios/interfaces/place-repository';

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  constructor(@Inject(PLACE_REPOSITORY_TOKEN) private placeRepo: PlaceRepository) { }

  createPlaceC(idPlace: string, coordenadas: number[]){
    return null;
  }

  createPlaceT(idPlace: string, toponimo: string){
    return null;
  }  

  getPlaces(){
    return this.placeRepo.getPlaces();
    }

  deletePlace(idPlace: string){
    return null;
  }
}