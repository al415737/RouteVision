import { inject, Inject, Injectable } from '@angular/core'; 
import { AuthStateService } from '../utils/auth-state.service';
import { throwError } from 'rxjs';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';

const pathPlace = 'place';

@Injectable({
  providedIn: 'root'
})

export class RouteService {
  private _authState: AuthStateService = inject(AuthStateService);
  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository) { }

}