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
import { of } from 'rxjs';
import { FirestoreService } from '../repositorios/firebase/firestore.service';
import { GeocodingPlaceMockComponent } from '../Mocks/geocoding-place-mock/geocoding-place-mock.component';



describe('PlaceService', () => {
  let servicePlace: PlaceService;
  let serviceUser: UserService;
  let component: GeocodingPlaceMockComponent;
  let fixture: ComponentFixture<GeocodingPlaceMockComponent>;
  let mockGeocoding;
  let resultado: boolean;
  let firestore: FirestoreService;

  beforeEach(() => {
    const mockData = {toponimo: ["Castellón de la Plana"]};
    mockGeocoding = jasmine.createSpyObj('GeocodingService', ['getToponimo']);
    mockGeocoding.getToponimo.and.returnValue(of(mockData));

    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        PlaceService,
        { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService },
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService },
        { provide: GeocodingService, useValue: mockGeocoding},
      ] 
    }).compileComponents();

    fixture = TestBed.createComponent(GeocodingPlaceMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // mockGeocoding = new geocodingPlaceMock;
    resultado = component.conexionAPI([39.98, -0.049]);

    servicePlace = TestBed.inject(PlaceService);
    serviceUser = TestBed.inject(UserService);
  });

  fdescribe('PlaceService', () => {
    it('HU5E01. Registrar nuevo lugar de interés (Caso Válido):', async () => {
      //fixture.detectChanges();

      //GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
      await serviceUser.loginUser("test@test.com", "test123");     // Crear usuario (se logea automáticamente)
      expect(resultado).toBe(true);

      //  WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 39.98, Longitud: -0.049]
      const placeCreado = await servicePlace.createPlaceC([39.98, -0.049]);

      //THEN: El sistema registra el lugar de interés de Ana2002. → placeListAna2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049]}, idLugar = “000”}.    
      expect(placeCreado).toBeInstanceOf(Place);
//      expect(placeCreado.idPlace).toBeDefined(); 
      servicePlace.deletePlace(placeCreado.idPlace);
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