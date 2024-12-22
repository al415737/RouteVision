import { Inject, inject, Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { RouteRepository } from '../interfaces/route-repository';
import { FirestoreService } from './firestore.service';
import { InvalidLicenseException } from '../../excepciones/invalid-license-exception';
import { getAuth } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { openRouteService } from '../../APIs/Geocoding/openRoute.service';

@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{

    private origen: any;
    private destino: any;
    private trayectoria: any;
    private kilometros: any;

  firestore: FirestoreService = inject(FirestoreService);
  servicioAPI: openRouteService = inject(openRouteService);

  constructor() {}

  async calcularRuta(origen: string, destino: string, metodoMov: string) {
      const origenCoord = await new Promise<string> ((resolve) => {
        this.servicioAPI.getCoordenadas(origen).subscribe({
          next: (response: any) => {
              const coordenadas = response.features[0].geometry.coordinates;
              resolve(`${coordenadas[0]},${coordenadas[1]}`);
          }
        });
      });

      const destinoCoord = await new Promise<string> ((resolve) => {
        this.servicioAPI.getCoordenadas(destino).subscribe({
          next: (response: any) => {
              const coordenadas = response.features[0].geometry.coordinates;
              resolve(`${coordenadas[0]},${coordenadas[1]}`);
          }
        });
      });

      return firstValueFrom(this.servicioAPI.getRuta(origenCoord, destinoCoord, metodoMov));
  }

  
}