import { inject, Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { RouteRepository } from '../interfaces/route-repository';
import { FirestoreService } from './firestore.service';
import { InvalidLicenseException } from '../../excepciones/invalid-license-exception';
import { getAuth } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{

    private origen: any;
    private destino: any;
    private trayectoria: any;
    private kilometros: any;

  firestore: FirestoreService = inject(FirestoreService);

  constructor() {}
}