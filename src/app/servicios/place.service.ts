import { inject, Inject, Injectable } from '@angular/core'; 
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { Place } from '../modelos/place';
import { PlaceRepository, PLACE_REPOSITORY_TOKEN } from '../repositorios/interfaces/place-repository';
import { AuthStateService } from '../utils/auth-state.service';
import { throwError } from 'rxjs';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';

const pathPlace = 'place';

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  private _authState: AuthStateService = inject(AuthStateService);
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
      throw new InvalidCoordenatesException();
    }
    
    return this.placeRepositorio.createPlaceT(toponimo);
  }

  getPlaces(){
    return this.placeRepositorio.getPlaces();
    }

  deletePlace(idPlace: string){
    return this.placeRepositorio.deletePlace(idPlace);
  }

}