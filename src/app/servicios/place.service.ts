import { Inject, Injectable } from '@angular/core'; 
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { Place } from '../modelos/place';
import { PLACE_REPOSITORY_TOKEN, PlaceRepository } from '../repositorios/interfaces/place-repository';


const pathPlace = 'place';

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  static createPlaceC(arg0: number[]) {
    throw new Error('Method not implemented.');
  }
  constructor(@Inject(PLACE_REPOSITORY_TOKEN) private placeRepositorio: PlaceRepository) { }

  createPlaceC(coordenadas: number[]){
    if (coordenadas.length != 2) {
      throw new InvalidCoordenatesException();
    }
    
    //latitud - coordenadas[0] --> [-90 y +90]
    //longitud - coordenadas[1] --> [-180 y +180]
    if(coordenadas[0] < -90 || coordenadas[0] > 90){
        throw new InvalidCoordenatesException();
    } else if(coordenadas[1] < -180 || coordenadas[1] > 180){
        throw new InvalidCoordenatesException();
    }
    
    return this.placeRepositorio.createPlaceC(coordenadas);
  } 

  deletePlace(idPlace: string){
    return this.placeRepositorio.deletePlace(idPlace);
  }
}