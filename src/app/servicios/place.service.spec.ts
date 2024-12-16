import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaceService } from './place.service';
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { Place } from '../modelos/place';
import { InvalidPlaceException } from '../excepciones/invalid-place-exception';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';
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
import { GeocodingPlaceMockComponent } from '../Mocks/geocoding-place-mock/geocoding-place-mock.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';




describe('PlaceService', () => {
  let servicePlace: PlaceService;
  let serviceUser: UserService;
  let component: GeocodingPlaceMockComponent;
  let fixture: ComponentFixture<GeocodingPlaceMockComponent>;
  //let mockGeocoding;
  let resultado: boolean;
  let firestore: FirestoreService;
  let geocodinRepositorio: GeocodingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Agregado para manejar HttpClient
      ],
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
    })//.compileComponents();

    // fixture = TestBed.createComponent(GeocodingPlaceMockComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();

    // mockGeocoding = new geocodingPlaceMock;
    
    //resultado = component.conexionAPI([39.98, -0.049]);

    servicePlace = TestBed.inject(PlaceService);
    serviceUser = TestBed.inject(UserService);
    geocodinRepositorio = TestBed.inject(GeocodingService); 
  });

  fdescribe('PlaceService', () => {
    it('HU5E01. Registrar nuevo lugar de interés (Caso Válido):', async () => {

      // GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
      await serviceUser.loginUser("test@test.com", "test123");     // Crear usuario (se logea automáticamente)
      spyOn(geocodinRepositorio, "getToponimo").and.returnValue(of({toponimo: 'Castellón de la Plana'}));
      
      const result = await firstValueFrom(geocodinRepositorio.getToponimo([39.98, -0.049]));
      expect(result).toEqual({toponimo: 'Castellón de la Plana'});

      // WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 39.98, Longitud: -0.049]
      const createPlace = await servicePlace.createPlaceC([39.98, -0.049]);

      // THEN: El sistema registra el lugar de interés de Ana2002. → placeListAna2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049]}, idLugar = “000”}.    
      expect(createPlace).toBeInstanceOf(Place);
      expect(createPlace.idPlace).toBeDefined(); 
      servicePlace.deletePlace(createPlace.idPlace);
    });
  });

  //it('HU5E02. Registro de un lugar de interés incorrecto (Caso Inválido):', () => {
    /*  GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
        WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 899,98, Longitud:].
        THEN: El sistema no registra el lugar de interés y lanza la excepción InvalidCoordinatesException().
    */ 
    //expect(service.createPlaceC("001", [39.98, -8888])).toThrow(InvalidCoordenatesException);
  //});
});