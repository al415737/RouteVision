import { inject, Inject, Injectable } from '@angular/core'; 
import { AuthStateService } from '../utils/auth-state.service';
import { throwError } from 'rxjs';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
import { InvalidCalculateRoute } from '../excepciones/invalid-calculate-route';

const pathPlace = 'route';

@Injectable({
  providedIn: 'root'
})

export class RouteService {
  private _authState: AuthStateService = inject(AuthStateService);

  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository) { }

  calcularRuta(origen: string, destino: string, metodoMov: string) {
      if(origen == '' || origen == null || destino == '' || destino == null || metodoMov == '' || metodoMov == null){
          throw new InvalidCalculateRoute();
      }

      this.routeRepository.calcularRuta(origen, destino, metodoMov);
  }

}