import { TestBed } from '@angular/core/testing';
import { UserService } from '../../servicios/user.service';
import { USER_REPOSITORY_TOKEN } from '../../repositorios/interfaces/user-repository';
import { Vehiculo } from '../../modelos/vehiculo';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../../app.config';
import { RouteService } from '../../servicios/route.service';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../../repositorios/interfaces/route-repository';
import { RouteFirebaseService } from '../../repositorios/firebase/route-firebase.service';
import { VehicleNotFoundException } from '../../excepciones/vehicle-not-Found-Exception';
import { provideHttpClient } from '@angular/common/http';
import { PlaceService } from '../../servicios/place.service';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';
import { Route } from '../../modelos/route';

describe('VehiculoIntegrationService', () => {
    let routeService: RouteService;
    let routeRepo: RouteRepository;
    let servicioPlace: PlaceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ 
                provideHttpClient(), // Configuración moderna para HttpClient
                provideFirebaseApp(() => initializeApp(firebaseConfig)),     
                provideFirestore(() => getFirestore()),
                provideAuth(() => getAuth()),
                RouteService,
                {
                    provide: ROUTE_REPOSITORY_TOKEN, useClass: RouteFirebaseService
                }
            ]
        }).compileComponents();

        routeService = TestBed.inject(RouteService);
        routeRepo = TestBed.inject(ROUTE_REPOSITORY_TOKEN);
        servicioPlace = TestBed.inject(PlaceService);
    });


    it('HU13E01. Cálculo de ruta entre dos puntos de interés (Escenario Válido)', async () => {
        //Given: El Usuario  [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], 
                    // vehículos = [“Coche1”, “Moto1”] .
        const mockData = { trayectoria: [ "0.363239, 39.464781", "-0.161966, 39.803153", "-0.076461, 39.979548", "-0.037829, 39.988886" ], distancia: 75688, duracion: 3610 };
        spyOn(routeRepo, 'calcularRuta').and.resolveTo(mockData);

        const lugar1 = await servicioPlace.createPlaceT("València, España");
        const lugar2 = await servicioPlace.createPlaceT("Castellón de la Plana");

        //When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche1”.
        const ruta = routeService.calcularRuta(lugar1, lugar2, "driving-car");
    
        //Then: El sistema muestra Trayecto=[Valencia, Paterna, Puzol, Sagunto, Moncófar, Villareal, Castellon], distancia=84km, duración=1h.
        expect(routeRepo.calcularRuta).toHaveBeenCalledWith(lugar1, lugar2, "driving-car");
        expect(ruta).toEqual(mockData);

    });
    
    it('HU13E03. Método de movilidad no válido (Escenario Inválido)', async () => {
        // Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], vehículos = [“Coche1”, “Moto1”, “Bicicleta1”].
        spyOn(routeRepo, 'calcularRuta').and.resolveTo(VehicleNotFoundException);
        const lugar1 = await servicioPlace.createPlaceT("València, España");
        const lugar2 = await servicioPlace.createPlaceT("Castellón de la Plana");

        try{
            // When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche2”.
            routeService.calcularRuta(lugar1, lugar2, "Coche2");
            expect(routeRepo.calcularRuta).toHaveBeenCalledWith(lugar1, lugar2, "Coche2");
        } catch(error){
                //Then: El sistema lanza la excepción VehicleNotFoundException().
                expect(error).toBeInstanceOf(VehicleNotFoundException);
        }
    });

    //HISTORIA 14
  it('PRUEBA INTEGRACIÓN --> H14-E01. Cálculo del coste asociado a la realización de una ruta en coche (Escenario Válido): ', async () => {
    const mockFuelCostRoute: number = 11.51;
    
    spyOn(routeRepo, 'obtenerCosteRuta').and.resolveTo(mockFuelCostRoute);
    
    const result = await routeService.obtenerCosteRuta(new Vehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1), new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90));
    
    expect(routeRepo.obtenerCosteRuta).toHaveBeenCalledWith(new Vehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1), new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90));
    expect(result).toEqual(mockFuelCostRoute);
  });

  it('PRUEBA INTEGRACIÓN --> H14-E04. Cálculo del coste asociado a la realización de una ruta en coche utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
    const mockFuelCostRoute: number = 11.51;

    spyOn(routeRepo, 'obtenerCosteRuta').and.resolveTo(mockFuelCostRoute);

    const vehiculoNoExiste = new Vehiculo("3423 WCX", "Fiat", "Punto", "2016", 8.1);
    const rutaValida = new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90);

    try {
        await routeService.obtenerCosteRuta(vehiculoNoExiste, rutaValida);
    } catch (error) {
        expect(error).toBeInstanceOf(NotExistingObjectException);
    }
  });
});