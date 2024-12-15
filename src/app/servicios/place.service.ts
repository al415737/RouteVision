import { Inject, Injectable } from '@angular/core'; 
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { Place } from '../modelos/place';
import { PLACE_REPOSITORY_TOKEN, PlaceRepository } from '../repositorios/interfaces/place-repository';

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  constructor(@Inject(PLACE_REPOSITORY_TOKEN) private placeRepositorio: PlaceRepository) { }

  createPlaceC(coordenadas: number[]){
    return this.placeRepositorio.createPlaceC(coordenadas);
  } 

  deletePlace(idPlace: string){
    return this.placeRepositorio.deletePlace(idPlace);
  }
}