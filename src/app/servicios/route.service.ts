import { Inject, Injectable } from '@angular/core';
import { Place } from '../modelos/place';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { TypeNotChosenException } from '../excepciones/type-not-chosen-exception';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  // Devuelve una lista de dos elementos (distacnia - km y duración - min)
  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository) { }

  // Conseguir una ruta rápida, corta o económica
  getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any> {
    if (!preferencia.trim())
      throw new TypeNotChosenException();

    if (!movilidad.trim() || !preferencia.trim())
      throw new ObligatoryFieldsException();

    return this.routeRepository.getRouteFSE(start, end, movilidad, preferencia);
  }
}
