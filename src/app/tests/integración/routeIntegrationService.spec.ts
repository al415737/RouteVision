import { TestBed } from '@angular/core/testing';
import { PlaceService } from '../../servicios/place.service';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../../repositorios/interfaces/route-repository';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
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
import { Route } from '../../modelos/route';
import { Vehiculo } from '../../modelos/vehiculo';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';

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
  it('PRUEBA INTEGRACIÓN --> H14-E01. Cálculo del coste asociado a la realización de una ruta en coche (Escenario Válido): ', async () => {
    const mockFuelCostRoute: number = 11.51;
    
    spyOn(RouteRepository, 'obtenerCosteRuta').and.resolveTo(mockFuelCostRoute);
    
    const result = await serviceRoute.obtenerCosteRuta(new Vehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1), new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90));
    
    expect(serviceRoute.obtenerCosteRuta).toHaveBeenCalledWith(new Vehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1), new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90));
    expect(result).toEqual(mockFuelCostRoute);
  });

  it('PRUEBA INTEGRACIÓN --> H14-E04. Cálculo del coste asociado a la realización de una ruta en coche utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
    const mockRoute: Route = new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90);

    spyOn(placeRepositorio, 'createPlaceC').and.resolveTo(mockPlace);
  
    try{
      servicePlace.createPlaceC([899.99, ]);
      expect(placeRepositorio.createPlaceC).toHaveBeenCalledWith([899.99, ]);
    } catch(error) {
      expect(error).toBeInstanceOf(InvalidCoordenatesException);
    }
    
    
    
    await servicioUsuario.loginUser("test@test.com", "test123"); 
    const vehiculo = await serviceVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
    const vehiculoNoExiste = await serviceVehiculo.crearVehiculo("3423 WCX", "Fiat", "Punto", "2016", 8.1); //este vehículo NO EXISTE EN LA BBDD DEL USUARIO
    const ruta = new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90);

    await expectAsync(servicioRutas.obtenerCosteRuta(vehiculoNoExiste, ruta)).toBeRejectedWith(new NotExistingObjectException());
    serviceVehiculo.eliminarVehiculo(vehiculo.getMatricula());
    serviceVehiculo.eliminarVehiculo(vehiculoNoExiste.getMatricula());
  });

})