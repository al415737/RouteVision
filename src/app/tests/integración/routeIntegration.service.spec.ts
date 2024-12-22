import { TestBed } from '@angular/core/testing';
import { RouteService } from '../../servicios/route.service';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from '../../app.config';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { TypeNotChosenException } from '../../excepciones/type-not-chosen-exception';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../../repositorios/interfaces/route-repository';
import { RouteFirebaseService } from '../../repositorios/firebase/route-firebase.service';
import { Place } from '../../modelos/place';

describe('RouteIntegrationService', () => {
  let service: RouteService;
  let routeRepo: RouteRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Configuración moderna para HttpClient
        provideFirebaseApp(() => initializeApp(firebaseConfig)), 
        provideFirestore(() => getFirestore()), 
        provideAuth(() => getAuth()),
        RouteService,  
        { provide: ROUTE_REPOSITORY_TOKEN, useClass: RouteFirebaseService },            
      ]
    });
    service = TestBed.inject(RouteService);
    routeRepo = TestBed.inject(ROUTE_REPOSITORY_TOKEN);
  });

  it('H16E01. Ruta más rápida/corta/económica calculada correctamente (Caso Válido)', async () => {
    const mockRoute: number[] = [52.863, 46.388333333333335];
    spyOn(routeRepo, 'getRouteFSE').and.resolveTo(mockRoute);

    const place: Place = new Place("000", 'Sagunto', []);
    const place2: Place = new Place("001", 'Castellón de la Plana', []);
    const result = await service.getRouteFSE(place, place2, "driving-car", "fastest");

    expect(routeRepo.getRouteFSE).toHaveBeenCalledWith(place, place2, "driving-car", "fastest");
    expect(result).toEqual(mockRoute);
    
  });

  it('H16E02. Tipo de ruta no seleccionada (Caso Inválido)', async () => {
    const mockRoute: number[] = [52.863, 46.388333333333335];
    spyOn(routeRepo, 'getRouteFSE').and.resolveTo(mockRoute);

    const place: Place = new Place("000", 'Sagunto', []);
    const place2: Place = new Place("001", 'Castellón de la Plana', []);

    try {
        service.getRouteFSE(place, place2, "driving-car", "")
        expect(routeRepo.getRouteFSE).toHaveBeenCalledWith(place, place2, "driving-car", "");
    } catch (error) {
        expect(error).toBeInstanceOf(TypeNotChosenException);
    }    
  });
});
