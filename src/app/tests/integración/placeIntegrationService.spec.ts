import { TestBed } from '@angular/core/testing';
import { PlaceService } from '../../servicios/place.service';
import { Place } from '../../modelos/place';
import { PLACE_REPOSITORY_TOKEN, PlaceRepository } from '../../repositorios/interfaces/place-repository';
import { provideHttpClient } from '@angular/common/http';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../app.config';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { AuthStateService } from '../../utils/auth-state.service';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';

describe('PlaceIntegrationService', () => {

  let servicePlace: PlaceService;
  let geocodingRepositorio: OpenRouteService;
  let placeRepositorio: PlaceRepository;
  let authStateService: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Configuración moderna para HttpClient
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        PlaceService,
        { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService }
      ]
    }).compileComponents();

    placeRepositorio = TestBed.inject(PLACE_REPOSITORY_TOKEN);

    servicePlace = TestBed.inject(PlaceService);
    geocodingRepositorio = TestBed.inject(OpenRouteService); 
    authStateService = TestBed.inject(AuthStateService);
  });

  //HISTORIA 5
  it('PRUEBA INTEGRACIÓN --> HU5E01. Registrar nuevo lugar de interés (Caso Válido):', async () => {
    const mockPlace: Place = new Place('001', "Castellón de la Plana", [39.98, -0.049], "Castellón");

    spyOn(placeRepositorio, 'createPlaceC').and.resolveTo(mockPlace);
    
    const result = await servicePlace.createPlaceC([39.98, -0.049]);
    expect(placeRepositorio.createPlaceC).toHaveBeenCalledWith([39.98, -0.049]);
    expect(result).toEqual(mockPlace);
  });

  it('PRUEBA INTEGRACIÓN --> HU5E02. Registro de un lugar de interés incorrecto (Caso Inválido):', async () => {
    const mockPlace: Place = new Place('001', "Castellón de la Plana", [39.98, -0.049], "Castellón");

    spyOn(placeRepositorio, 'createPlaceC').and.resolveTo(mockPlace);
  
    try{
      await servicePlace.createPlaceC([899.99, ]);
      expect(placeRepositorio.createPlaceC).toHaveBeenCalledWith([899.99, ]);
    } catch(error) {
      expect(error).toBeInstanceOf(InvalidCoordenatesException);
    }
  });


  //HISTORIA 6
  it('PRUEBA INTEGRACIÓN --> HU6E01. Registro de lugar de interés con un topónimo correcto (Escenario Válido):', async () => {
    const mockPlace: Place = new Place('002', "Bilbao", [43.26271, -2.92528], "Bilbao");

    spyOn(placeRepositorio, 'createPlaceT').and.resolveTo(mockPlace);
    
    const result = await servicePlace.createPlaceT("Bilbao");
    expect(placeRepositorio.createPlaceT).toHaveBeenCalledWith("Bilbao");
    expect(result).toEqual(mockPlace);
  });

  it('PRUEBA INTEGRACIÓN --> HU6E01. Registro de lugar de interés con un topónimo correcto (Escenario Válido):', async () => {
    const mockPlace: Place = new Place('002', "Bilbao", [43.26271, -2.92528], "Bilbao");

    spyOn(placeRepositorio, 'createPlaceT').and.resolveTo(mockPlace);
  
    try{
      await servicePlace.createPlaceT('');
      expect(placeRepositorio.createPlaceT).toHaveBeenCalledWith('');
    } catch(error) {
      expect(error).toBeInstanceOf(InvalidPlaceException);
    }
  });

  it('PRUEBA INTEGRACIÓN --> HU7E01. Consulta de lista de lugares dados de alta (Escenario válido):', async () => {
    const mockPlace: Place[] = [new Place('001', "Castellón de la Plana", [39.98, -0.049], "Castellón"), new Place('002', "Barcelona", [33.98, -0.049], "Barcelona")];

    spyOn(placeRepositorio, 'getPlaces').and.resolveTo(mockPlace);
    
    const result = await servicePlace.getPlaces();
    expect(placeRepositorio.getPlaces).toHaveBeenCalledWith();
    expect(result).toEqual(mockPlace);
  });

  it('PRUEBA INTEGRACIÓN --> HU7E02. Consulta de lista de lugares dados de alta sin estar registrado (Escenario inválido):', async () => {
    const mockPlace: Place[] = [new Place('001', "Castellón de la Plana", [39.98, -0.049], "Castellón"), new Place('002', "Barcelona", [33.98, -0.049], "Barcelona")];
    spyOn(placeRepositorio, 'getPlaces').and.resolveTo(mockPlace);
    spyOn(authStateService as any, 'currentUser').and.returnValue(null);
  
    try{
      await servicePlace.getPlaces();
      expect(placeRepositorio.getPlaces).toHaveBeenCalledWith();
    } catch(error) {
      expect(error).toBeInstanceOf(ServerNotOperativeException);
    }
    expect(authStateService.currentUser).toBeNull();
  });

  it('HU8E01. Eliminación de un lugar de interés de la lista de lugares de interés del usuario (Escenario Válido):', async() => {
    const mockPlace: Place = new Place('001', "Castellón de la Plana", [39.98, -0.049], "Castellón");
    spyOn(placeRepositorio, 'deletePlace').and.resolveTo(true);
    const result = await servicePlace.deletePlace(mockPlace.idPlace);
    expect(placeRepositorio.deletePlace).toHaveBeenCalledWith(mockPlace.idPlace);
    expect(result).toEqual(true);
  });
  
  it('HU8E02. Eliminación de un lugar de interés que no está en la lista de lugares de interés del usuario (Escenario Inválido):', async() => {
    spyOn(placeRepositorio, 'deletePlace').and.resolveTo(true);
    try {
      await servicePlace.deletePlace('025');
      expect(placeRepositorio.deletePlace).toHaveBeenCalledWith('025');
    } catch (error) {
      throw new NotExistingObjectException(); 
    }
  });
})