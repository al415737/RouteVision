import { TestBed } from '@angular/core/testing';
import { PlaceService } from '../../servicios/place.service';
import { Place } from '../../modelos/place';
import { PLACE_REPOSITORY_TOKEN, PlaceRepository } from '../../repositorios/interfaces/place-repository';
import { GeocodingService } from '../../APIs/Geocoding/geocoding.service';
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

describe('PlaceIntegrationService', () => {

  let servicePlace: PlaceService;
  let geocodingRepositorio: GeocodingService;
  let placeRepositorio: PlaceRepository;

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
    geocodingRepositorio = TestBed.inject(GeocodingService); 
  });

  //HISTORIA 5
  fdescribe('PlaceService', () => {  //HISTORIA 5
    it('PRUEBA INTEGRACIÓN --> HU5E01. Registrar nuevo lugar de interés (Caso Válido):', async () => {
      const mockPlace: Place = new Place('001', "Castellón de la Plana", [39.98, -0.049]);

      spyOn(placeRepositorio, 'createPlaceC').and.resolveTo(mockPlace);
      
      const result = await servicePlace.createPlaceC([39.98, -0.049]);
      expect(placeRepositorio.createPlaceC).toHaveBeenCalledWith([39.98, -0.049]);
      expect(result).toEqual(mockPlace);
    });
  })

  fdescribe('PlaceService', () => {  
    it('PRUEBA INTEGRACIÓN --> HU5E02. Registro de un lugar de interés incorrecto (Caso Inválido):', async () => {
      const mockPlace: Place = new Place('001', "Castellón de la Plana", [39.98, -0.049]);

      spyOn(placeRepositorio, 'createPlaceC').and.resolveTo(mockPlace);
    
      try{
        servicePlace.createPlaceC([899.99, ]);
        expect(placeRepositorio.createPlaceC).toHaveBeenCalledWith([899.99, ]);
      } catch(error) {
        expect(error).toBeInstanceOf(InvalidCoordenatesException);
      }
    });
  })


  //HISTORIA 6
  fdescribe('PlaceService', () => {  //HISTORIA 5
    it('PRUEBA INTEGRACIÓN --> HU6E01. Registro de lugar de interés con un topónimo correcto (Escenario Válido):', async () => {
      const mockPlace: Place = new Place('002', "Bilbao", [43.26271, -2.92528]);

      spyOn(placeRepositorio, 'createPlaceT').and.resolveTo(mockPlace);
      
      const result = await servicePlace.createPlaceT('Bilbao');
      expect(placeRepositorio.createPlaceT).toHaveBeenCalledWith('Bilbao');
      expect(result).toEqual(mockPlace);
    });
  })

  fdescribe('PlaceService', () => {  
    it('PRUEBA INTEGRACIÓN --> HU6E01. Registro de lugar de interés con un topónimo correcto (Escenario Válido):', async () => {
      const mockPlace: Place = new Place('002', "Bilbao", [43.26271, -2.92528]);

      spyOn(placeRepositorio, 'createPlaceT').and.resolveTo(mockPlace);
    
      try{
        servicePlace.createPlaceT('Cassjdlftellfisonon');
        expect(placeRepositorio.createPlaceT).toHaveBeenCalledWith('Cassjdlftellfisonon');
      } catch(error) {
        expect(error).toBeInstanceOf(InvalidPlaceException);
      }
    });
  })
})