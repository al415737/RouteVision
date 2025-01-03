import { inject, Inject, Injectable } from '@angular/core'; 
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { PlaceRepository, PLACE_REPOSITORY_TOKEN } from '../repositorios/interfaces/place-repository';
import { AuthStateService } from '../utils/auth-state.service';
import { InvalidPlaceException } from '../excepciones/invalid-place-exception';
import { Place } from '../modelos/place';

const pathPlace = 'place';

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
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

  createPlaceT(toponimo: string){
    if (toponimo == null || toponimo == '') {
      throw new InvalidPlaceException();
    }
    return this.placeRepositorio.createPlaceT(toponimo);
  }

  getPlaces(){
    return this.placeRepositorio.getPlaces();
    }

  async deletePlace(idPlace: string): Promise<boolean> {
    return await this.placeRepositorio.deletePlace(idPlace);
  }

  async marcarFavorito(place: Place, favorito: boolean){
      return await this.placeRepositorio.marcarFavorito(place, favorito);
  }


}