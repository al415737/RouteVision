import { TestBed } from '@angular/core/testing';
import { PlaceService } from './place.service';
import { Place } from '../modelos/place';
import { UserService } from './user.service';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../app.config';
import { PLACE_REPOSITORY_TOKEN } from '../repositorios/interfaces/place-repository';
import { UserFirebaseService } from '../repositorios/firebase/user-firebase.service';
import { USER_REPOSITORY_TOKEN } from '../repositorios/interfaces/user-repository';
import { PlaceFirebaseService } from '../repositorios/firebase/place-firebase.service';
import { GeocodingService } from '../APIs/Geocoding/geocoding.service';
import { of, firstValueFrom } from 'rxjs';
import { FirestoreService } from '../repositorios/firebase/firestore.service';
import { provideHttpClient } from '@angular/common/http';
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';


describe('PlaceService', () => {
  let servicePlace: PlaceService;
  let serviceUser: UserService;
  let geocodinRepositorio: GeocodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Configuración moderna para HttpClient
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        PlaceService,
        { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService },
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService },
        FirestoreService,
      ] 
    })

    servicePlace = TestBed.inject(PlaceService);
    serviceUser = TestBed.inject(UserService);
    geocodinRepositorio = TestBed.inject(GeocodingService); 
  });

  fdescribe('PlaceService', () => {
    it('HU5E01. Registrar nuevo lugar de interés (Caso Válido):', async () => {

      // GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
      await serviceUser.loginUser("test@test.com", "test123"); 
      spyOn(geocodinRepositorio, "getToponimo").and.returnValue(of({toponimo: 'Castellón de la Plana'}));
      
      const result = await firstValueFrom(geocodinRepositorio.getToponimo([39.98, -0.049]));
      expect(result).toEqual({toponimo: 'Castellón de la Plana'});

      // WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 39.98, Longitud: -0.049]
      const createPlace = await servicePlace.createPlaceC([39.98, -0.049]);

      // THEN: El sistema registra el lugar de interés de Ana2002. → placeListAna2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049]}, idLugar = “000”}.    
      expect(createPlace).toBeInstanceOf(Place);
      expect(createPlace.idPlace).toBeDefined(); 
      await servicePlace.deletePlace(createPlace.idPlace);
    });
  });

  fdescribe('PlaceService', () => {
    it('HU5E02. Registro de un lugar de interés incorrecto (Caso Inválido):', async () => {
      // GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
      await serviceUser.loginUser("test@test.com", "test123");

      try{
        // WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 899,98, Longitud:].
        const createPlaceInvalid = await servicePlace.createPlaceC([899.98, ]);
      } catch (error){  
        // THEN: El sistema no registra el lugar de interés y lanza la excepción InvalidCoordinatesException().
        expect(error).toBeInstanceOf(InvalidCoordenatesException);
      }
    });
  });
});
