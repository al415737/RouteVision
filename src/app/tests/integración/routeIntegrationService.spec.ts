import { TestBed } from '@angular/core/testing';
import { PlaceService } from '../../servicios/place.service';
import { Route, Router, Routes } from '@angular/router';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../../repositorios/interfaces/route-repository';
import { GeocodingService } from '../../APIs/Geocoding/geocoding.service';
import { provideHttpClient } from '@angular/common/http';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../app.config';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { RouteFirebaseService } from '../../repositorios/firebase/route-firebase.service';

import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';
import { RouteService } from '../../servicios/route.service';

describe('PlaceIntegrationService', () => {

  let serviceRoute: RouteService;
  let RouteRepository: RouteRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Configuración moderna para HttpClient
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        PlaceService,
        { provide: ROUTE_REPOSITORY_TOKEN, useClass: RouteFirebaseService }
      ]
    }).compileComponents();

    RouteRepository = TestBed.inject(ROUTE_REPOSITORY_TOKEN);

    serviceRoute = TestBed.inject(RouteService);
});

  //HISTORIA 14


})