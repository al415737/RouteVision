import { TestBed } from '@angular/core/testing';

import { RouteService } from '../../servicios/route.service';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from '../../app.config';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { UserService } from '../../servicios/user.service';
import { PlaceService } from '../../servicios/place.service';
import { USER_REPOSITORY_TOKEN } from '../../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { PLACE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/place-repository';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';
import { TypeNotChosenException } from '../../excepciones/type-not-chosen-exception';

describe('RouteService', () => {
  let service: RouteService;
  let userService: UserService;
  let placeService: PlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
              provideHttpClient(), // Configuración moderna para HttpClient
              provideFirebaseApp(() => initializeApp(firebaseConfig)), 
              provideFirestore(() => getFirestore()), 
              provideAuth(() => getAuth()),
              UserService,
              PlaceService,
              { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService },
              { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService },              
            ]
    });
    service = TestBed.inject(RouteService);
    userService = TestBed.inject(UserService);
    placeService = TestBed.inject(PlaceService);
  });

  it('H16E01. Ruta más rápida/corta/económica calculada correctamente (Caso Válido)', async () => {
    await userService.loginUser("test@test.com", "test123");
    const place = await placeService.createPlaceT("Valencia");
    const place2 = await placeService.createPlaceT("Castellón de la Plana");

    const result = service.getRouteFSE(place, place2, "driving-car", "fastest");
    expect(result).toEqual(["Valencia","Paterna", "Puzol", "Sagunto", "Moncófar", "Castllón de la Plana"]);
    
    await placeService.deletePlace(place.idPlace);
    await placeService.deletePlace(place2.idPlace);
    await userService.logoutUser();
  });

  it('H16E02. Tipo de ruta no seleccionada (Caso Inválido)', async () => {
    await userService.loginUser("test@test.com", "test123");
    const place = await placeService.createPlaceT("Valencia");
    const place2 = await placeService.createPlaceT("Castellón de la Plana");

    await expectAsync(
      service.getRouteFSE(place, place2, "driving-car", "")
        ).toBeRejectedWith(new TypeNotChosenException());
    
    await placeService.deletePlace(place.idPlace);
    await placeService.deletePlace(place2.idPlace);
    await userService.logoutUser();
  });
});
