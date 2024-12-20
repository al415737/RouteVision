import { TestBed } from '@angular/core/testing';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { PLACE_REPOSITORY_TOKEN, PlaceRepository } from '../../repositorios/interfaces/place-repository';
import { provideHttpClient } from '@angular/common/http';
import { firebaseConfig } from '../../app.config';
import { PlaceService } from '../../servicios/place.service';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';
import { FirestoreService } from '../../repositorios/firebase/firestore.service';
import { Observable } from 'rxjs';
import { Place } from '../../modelos/place';

describe('PlaceIntegrationService', () => {
  let servicePlace: PlaceService;
  let placeRepository: PlaceRepository;

  beforeEach(() => {
    placeRepository = new PlaceFirebaseService();
    spyOn(placeRepository, "createPlaceC");
    spyOn(placeRepository, "createPlaceT");
    spyOn(placeRepository, "deletePlace");
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        PlaceService,
        { provide: PLACE_REPOSITORY_TOKEN, use
            ç: PlaceFirebaseService },
        FirestoreService,
      ]
    });

    servicePlace = TestBed.inject(PlaceService);
  });


  it('HU7E01. Consulta de lista de lugares dados de alta (Escenario válido):', async () => {
    spyOn(placeRepository, 'getPlaces').and.returnValue(
        Promise.resolve([])
      );
    const lugares = await servicePlace.getPlaces();
    expect(lugares.length).toBe(2);
    lugares.forEach((lugar: Place) => {
                expect(lugar).toBeInstanceOf(Place);
            });
  });

  /*it('HU7E02. Consulta de lista de lugares dados de alta sin conexión a la BBDD (Escenario inválido):', async () => {
    spyOn(serviceUser, 'loginUser').and.returnValue(Promise.resolve());
    spyOn(servicePlace, 'createPlaceC').and.returnValue(Promise.resolve(new Place('000', 'Castelló de la Plana', [39.98, -0.049])));
    spyOn(servicePlace, 'createPlaceT').and.returnValue(Promise.resolve(new Place('001', 'Bilbao', [43.26271, -2.92528])));
    spyOn(serviceUser, 'logoutUser').and.returnValue(Promise.resolve());
    spyOn(servicePlace, 'getPlaces').and.returnValue(Promise.reject(new ServerNotOperativeException()));

    await serviceUser.loginUser("test@test.com", "test123");
    const lugar1 = await servicePlace.createPlaceC([39.98, -0.049]);
    const lugar2 = await servicePlace.createPlaceT("Bilbao");
    await serviceUser.logoutUser();

    await expectAsync(servicePlace.getPlaces()).toBeRejectedWith(new ServerNotOperativeException());
  });*/ 
});