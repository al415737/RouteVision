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
import { VehicleNotFoundException } from '../../excepciones/vehicle-not-Found-Exception';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';
import { Route } from '../../modelos/route';
import { Vehiculo } from '../../modelos/vehiculo';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';

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
        { provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService },       
      ]
    });
    service = TestBed.inject(RouteService);
    routeRepo = TestBed.inject(ROUTE_REPOSITORY_TOKEN);
  });

  it('HU13E01. Cálculo de ruta entre dos puntos de interés (Escenario Válido)', async () => {
          //Given: El Usuario  [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], 
                      // vehículos = [“Coche1”, “Moto1”] .
          const mockData = { trayectoria: [ "0.363239, 39.464781", "-0.161966, 39.803153", "-0.076461, 39.979548", "-0.037829, 39.988886" ], distancia: 75688, duracion: 3610 };
          spyOn(routeRepo, 'calcularRuta').and.resolveTo(mockData);
  
          //When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche1”.
          const ruta = await routeRepo.calcularRuta("Valencia", "Castellón de la Plana", "driving-car");
      
          //Then: El sistema muestra Trayecto=[Valencia, Paterna, Puzol, Sagunto, Moncófar, Villareal, Castellon], distancia=84km, duración=1h.
          expect(routeRepo.calcularRuta).toHaveBeenCalledWith("Valencia", "Castellón de la Plana", "driving-car");
          expect(ruta).toEqual(mockData);
  
      });
      
      it('HU13E03. Método de movilidad no válido (Escenario Inválido)', async () => {
          // Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], vehículos = [“Coche1”, “Moto1”, “Bicicleta1”].
          spyOn(routeRepo, 'calcularRuta').and.resolveTo(VehicleNotFoundException);
  
          try{
              // When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche2”.
              routeRepo.calcularRuta("Valencia", "Castellón de la Plana", "Coche2");
              expect(routeRepo.calcularRuta).toHaveBeenCalledWith("Valencia", "Castellón de la Plana", "Coche2");
          } catch(error){
                  //Then: El sistema lanza la excepción VehicleNotFoundException().
                  expect(error).toBeInstanceOf(VehicleNotFoundException);
          }
      });
  
      //HISTORIA 14
    it('PRUEBA INTEGRACIÓN --> H14-E01. Cálculo del coste asociado a la realización de una ruta en coche (Escenario Válido): ', async () => {
      const mockFuelCostRoute: number = 11.51;
      
      spyOn(routeRepo, 'obtenerCosteRuta').and.resolveTo(mockFuelCostRoute);
      
      const result = await routeRepo.obtenerCosteRuta(new Vehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1), new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90));
      
      expect(routeRepo.obtenerCosteRuta).toHaveBeenCalledWith(new Vehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1), new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90));
      expect(result).toEqual(mockFuelCostRoute);
    });
  
    it('PRUEBA INTEGRACIÓN --> H14-E04. Cálculo del coste asociado a la realización de una ruta en coche utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
      const mockFuelCostRoute: number = 11.51;
  
      spyOn(routeRepo, 'obtenerCosteRuta').and.resolveTo(mockFuelCostRoute);
  
      const vehiculoNoExiste = new Vehiculo("3423 WCX", "Fiat", "Punto", "2016", 8.1);
      const rutaValida = new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90);
  
      try {
          await routeRepo.obtenerCosteRuta(vehiculoNoExiste, rutaValida);
      } catch (error) {
          expect(error).toBeInstanceOf(NotExistingObjectException);
      }
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
