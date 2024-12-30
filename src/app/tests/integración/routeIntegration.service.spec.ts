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
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';
import { AuthStateService } from '../../utils/auth-state.service';
import { NoRouteFoundException } from '../../excepciones/no-route-found-exception';
import { PlaceService } from '../../servicios/place.service';
import { CocheDiesel } from '../../modelos/vehiculos/cocheDiesel';
import { CocheGasolina } from '../../modelos/vehiculos/cocheGasolina';
import { PLACE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/place-repository';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';

describe('RouteIntegrationService', () => {
  let service: RouteService;
  let routeRepo: RouteRepository;
  let authStateService: AuthStateService;
  let servicioPlace: PlaceService;

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
        { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService },
      ]
    });
    service = TestBed.inject(RouteService);
    routeRepo = TestBed.inject(ROUTE_REPOSITORY_TOKEN);
    authStateService = TestBed.inject(AuthStateService);
    servicioPlace = TestBed.inject(PlaceService);
  });

  it('HU13E01. Cálculo de ruta entre dos puntos de interés (Escenario Válido)', async () => {
          //Given: El Usuario  [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], 
                      // vehículos = [“Coche1”, “Moto1”] .
          const mockData = { trayectoria: [ "0.363239, 39.464781", "-0.161966, 39.803153", "-0.076461, 39.979548", "-0.037829, 39.988886" ], distancia: 75688, duracion: 3610 };
          spyOn(routeRepo, 'calcularRuta').and.resolveTo(mockData);
          const lugar1 = await servicioPlace.createPlaceT("Valencia");
          const lugar2 = await servicioPlace.createPlaceT("Castellón");
  
          //When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche1”.
          const ruta = await routeRepo.calcularRuta(lugar1, lugar2, "driving-car");
      
          //Then: El sistema muestra Trayecto=[Valencia, Paterna, Puzol, Sagunto, Moncófar, Villareal, Castellon], distancia=84km, duración=1h.
          expect(routeRepo.calcularRuta).toHaveBeenCalledWith(lugar1, lugar2, "driving-car");
          expect(ruta).toEqual(mockData);
  
      });
      
      it('HU13E03. Método de movilidad no válido (Escenario Inválido)', async () => {
          // Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], vehículos = [“Coche1”, “Moto1”, “Bicicleta1”].
          spyOn(routeRepo, 'calcularRuta').and.resolveTo(VehicleNotFoundException);
          const lugar1 = await servicioPlace.createPlaceT("Valencia");
          const lugar2 = await servicioPlace.createPlaceT("Castellón");

          try{
              // When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche2”.
              await routeRepo.calcularRuta(lugar1, lugar2, "Coche2");
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
      
      const result = await routeRepo.obtenerCosteRuta(new CocheDiesel("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasoleo A", false), new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90, false));
      
      expect(routeRepo.obtenerCosteRuta).toHaveBeenCalledWith(new CocheDiesel("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasoleo A", false), new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90, false));
      expect(result).toEqual(mockFuelCostRoute);
    });
  
    it('PRUEBA INTEGRACIÓN --> H14-E04. Cálculo del coste asociado a la realización de una ruta en coche utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
      const mockFuelCostRoute: number = 11.51;
  
      spyOn(routeRepo, 'obtenerCosteRuta').and.resolveTo(mockFuelCostRoute);
  
      const vehiculoNoExiste = new CocheGasolina("3423 WCX", "Fiat", "Punto", "2016", 8.1, "Precio Gasolina 95 E5", false);
      const rutaValida = new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90, false);
  
      try {
          await routeRepo.obtenerCosteRuta(vehiculoNoExiste, rutaValida);
      } catch (error) {
          expect(error).toBeInstanceOf(NotExistingObjectException);
      }
    });

  it('H16E01. Ruta más rápida/corta/económica calculada correctamente (Caso Válido)', async () => {
    const mockRoute: number[] = [52.863, 46.388333333333335];
    spyOn(routeRepo, 'getRouteFSE').and.resolveTo(mockRoute);

    const place: Place = new Place("000", 'Sagunto', [], false);
    const place2: Place = new Place("001", 'Castellón de la Plana', [], false);
    const result = await service.getRouteFSE(place, place2, "driving-car", "fastest");

    expect(routeRepo.getRouteFSE).toHaveBeenCalledWith(place, place2, "driving-car", "fastest");
    expect(result).toEqual(mockRoute);
    
  });

  it('H16E02. Tipo de ruta no seleccionada (Caso Inválido)', async () => {
    const mockRoute: number[] = [52.863, 46.388333333333335];
    spyOn(routeRepo, 'getRouteFSE').and.resolveTo(mockRoute);

    const place: Place = new Place("000", 'Sagunto', [], false);
    const place2: Place = new Place("001", 'Castellón de la Plana', [], false);

    try {
        service.getRouteFSE(place, place2, "driving-car", "")
        expect(routeRepo.getRouteFSE).toHaveBeenCalledWith(place, place2, "driving-car", "");
    } catch (error) {
        expect(error).toBeInstanceOf(TypeNotChosenException);
    }    
  });

  it('HU15E01. Cálculo de coste calórico de la ruta Valencia-Castellón (Escenario Válido)', async () => {
    //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“ppt-24”] tiene su sesión iniciada y la base de datos está disponible. Lista rutas: [ {nombre: Valencia-Castellón, Origen:Valencia, Destino:Castellón de la Plana, Opción: economica, Movilidad: cycling-regular, kilómetros = 76, duracion = 15806}]
    const mockData = '2195.28';
    spyOn(routeRepo, 'costeRutaPieBicicleta').and.resolveTo(mockData);
    const origen = await servicioPlace.createPlaceT("València, España");
    const destino = await servicioPlace.createPlaceT("Castellón de la Plana");
    const ruta = new Route("Valencia-Castellón", "Valencia", "Castellón de la Plana", "economica", "cycling-regular", 76, 15806, false);

    //When: Se calcula el coste de la ruta Valencia-Castellón con la opción bicicleta
    const coste = await service.costeRutaPieBicicleta(ruta, origen, destino);

    //Then: El sistema calcula el tiempo que se tarda en realizar la ruta prevista que son 4 horas. El coste es de 500 calorías (1 hora) * 4,39 horas = 2195.28 calorías
    expect(routeRepo.costeRutaPieBicicleta).toHaveBeenCalledWith(ruta, origen, destino);
    expect(coste).toEqual(mockData);
  }); 

  it('HU15E03. Intento de cálculo de gasto calórico pero no hay rutas dadas de alta (Escenario Inválido)', async () => {
      //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“crm-24”] ha iniciado sesión y la base de datos está disponible. Lista rutas = []  
      spyOn(routeRepo, 'costeRutaPieBicicleta').and.resolveTo(NoRouteFoundException);
      const origen = await servicioPlace.createPlaceT("València, España");
      const destino = await servicioPlace.createPlaceT("Castellón de la Plana");
      const ruta = new Route("Valencia-Castellón", "Valencia", "Castellón de la Plana", "economica", "cycling-regular", 76, 3600, false);
  
      try {
          //When: El usuario Pepito quiere realizar la ruta entre Valencia y Castellón en bicicleta.
          await service.costeRutaPieBicicleta(ruta, origen, destino);  
          expect(routeRepo.costeRutaPieBicicleta).toHaveBeenCalledWith(ruta, origen, destino);
      } catch(error){
          //Then: El sistema no puede calcular el gasto calórico y lanza la excepción  NoRouteFoundException()
          expect(error).toBeInstanceOf(NoRouteFoundException);
      }
  });


  it('H17E01. Guardar una ruta que no existe en el sistema (Escenario válido)', async () => {
    const place: Place = new Place("000", 'Sagunto', [], false);
    const place2: Place = new Place("001", 'Castellón de la Plana', [], false);
    const mockRoute: Route = new Route("ruta01", place.getToponimo(), place2.getToponimo(), "driving-car", "fastest", 90, 60, false);

    spyOn(routeRepo, 'createRoute').and.resolveTo(mockRoute);

    const result = await service.createRoute("ruta01", place, place2, "driving-car", "fastest", 90, 60);
    expect(routeRepo.createRoute).toHaveBeenCalledWith("ruta01", place, place2, "driving-car", "fastest", 90, 60, false);
    expect(result).toEqual(mockRoute);
  });


  it('H17E02. Intento de guardar una ruta con lugares no registrados (Escenario inválido)', async () => {
    const placeAux: Place = new Place('005', 'Madrid', [], false);
    const placeAux2: Place = new Place('006', 'Barcelona', [], false);
    const mockRoute: Route = new Route("ruta01", placeAux.getToponimo(), placeAux2.getToponimo(), "driving-car", "fastest", 90, 60, false);

    spyOn(routeRepo, 'createRoute').and.resolveTo(mockRoute);

    try {
      service.createRoute("ruta01", placeAux, placeAux2, "driving-car", "fastest", 90, 60);
      expect(routeRepo.createRoute).toHaveBeenCalledWith("ruta01", placeAux, placeAux2, "driving-car", "fastest", 90, 60, false);
    } catch (error) {
      expect(error).toBeInstanceOf(NotExistingObjectException);
    } 
  });

  it('H18E01. Consultar rutas guardadas (Escenario Válido):', async () => {
    const mockRoute: Route[] = [new Route('ruta01', "Sagunto", "Alicante", "driving-car", "fastest", 90, 60, false), new Route('ruta02', "Valencia", "Castellón de la Plana", "driving-car", "shortest", 84, 64, false)];
    spyOn(routeRepo, 'getRoutes').and.resolveTo(mockRoute);

    const result = await routeRepo.getRoutes();

    expect(routeRepo.getRoutes).toHaveBeenCalledWith();
    expect(result).toEqual(mockRoute);
    
  });

  it('H18E03. Intento de consulta de rutas guardadas pero el usuario no está registrado (Escenario Inválido):', async () => {
    const mockRoute: Route[] = [new Route('ruta01', "Sagunto", "Alicante", "driving-car", "fastest", 90, 60, false), new Route('ruta02', "Valencia", "Castellón de la Plana", "driving-car", "shortest", 84, 64, false)];
    spyOn(routeRepo, 'getRoutes').and.resolveTo(mockRoute);
    spyOn(authStateService as any, 'currentUser').and.returnValue(null);

    try {
      await routeRepo.getRoutes();
      expect(routeRepo.getRoutes).toHaveBeenCalledWith();
    } catch (error) {
        expect(error).toBeInstanceOf(ServerNotOperativeException);
    }   
    
    expect(authStateService.currentUser).toBeNull();
  });

  it('H19E01. Eliminar una ruta que existe en el sistema (Escenario válido):', async () => {
    spyOn(routeRepo, 'deleteRoute').and.resolveTo(true);

    const result = await routeRepo.deleteRoute('ruta01');

    expect(routeRepo.deleteRoute).toHaveBeenCalledWith('ruta01');
    expect(result).toEqual(true);
    
  });

  it('H19E04. Intento de eliminar una ruta sin estar registrado (Escenario inválido):', async () => {
    spyOn(routeRepo, 'deleteRoute').and.resolveTo(true);
    spyOn(authStateService as any, 'currentUser').and.returnValue(null);

    try {
      await routeRepo.deleteRoute('ruta1');
      expect(routeRepo.deleteRoute).toHaveBeenCalledWith('ruta1');
    } catch (error) {
        expect(error).toBeInstanceOf(ServerNotOperativeException);
    }   
    
    expect(authStateService.currentUser).toBeNull();
  });
});
