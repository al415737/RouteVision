import { TestBed } from '@angular/core/testing';
import { RouteService } from '../../servicios/route.service';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from '../../app.config';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { UserService } from '../../servicios/user.service';
import { PlaceService } from '../../servicios/place.service';
import { USER_REPOSITORY_TOKEN } from '../../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { PLACE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/place-repository';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';
import { TypeNotChosenException } from '../../excepciones/type-not-chosen-exception';
import { ROUTE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/route-repository';
import { RouteFirebaseService } from '../../repositorios/firebase/route-firebase.service';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { PrecioCarburantes } from '../../APIs/PrecioCarburantes/precioCarburantes.service';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';
import { VehicleNotFoundException } from '../../excepciones/vehicle-not-Found-Exception';
import { Route } from '../../modelos/route';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { Place } from '../../modelos/place';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';
import { NoRouteFoundException } from '../../excepciones/no-route-found-exception';
import { IncorrectMethodException } from '../../excepciones/incorrect-method-exception';
import { CocheGasolina } from '../../modelos/vehiculos/cocheGasolina';
import { CocheDiesel } from '../../modelos/vehiculos/cocheDiesel';

describe('RutasService', () => {
  let servicioVehiculo: VehiculoService;
  let servicioUsuario: UserService;
  let servicioRutas: RouteService;
  let servicioPlace: PlaceService;
  let openRoute: OpenRouteService;
  let precioCarburante: PrecioCarburantes;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideFirebaseApp(() => initializeApp(firebaseConfig)),     
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        VehiculoService,
        { provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService },  
        UserService,
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService }, 
        RouteService,
        { provide: ROUTE_REPOSITORY_TOKEN, useClass: RouteFirebaseService },
        PlaceService,
        { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService },
      ]
    });
    servicioVehiculo = TestBed.inject(VehiculoService);
    servicioUsuario = TestBed.inject(UserService);
    servicioRutas = TestBed.inject(RouteService);
    servicioPlace = TestBed.inject(PlaceService);
    openRoute = TestBed.inject(OpenRouteService);
    precioCarburante = TestBed.inject(PrecioCarburantes);
  });

  // it('HU13E01. Cálculo de ruta entre dos puntos de interés (Escenario Válido)', async () => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] autenticado,
  //   // lugares = [“Valencia”, “Castellón”, “Alicante”]
  //   await servicioUsuario.loginUser("test@test.com", "test123");

  //   const lugar1 = await servicioPlace.createPlaceT("València, España");
  //   const lugar2 = await servicioPlace.createPlaceT("Castellón de la Plana");
  //   const lugar3 = await servicioPlace.createPlaceT("Alicante");

  //   //WHEN: El usuario solicita el calculo con “Valencia-Castellón” y en vehiculo.
  //   const ruta = await servicioRutas.calcularRuta(lugar1, lugar2, "driving-car");
    
  //   const trayectoria = ruta.features[0].geometry.coordinates;      //coordenadas de toda la trayectoria
  //   const distancia = ruta.features[0].properties.summary.distance; //metros
  //   const duracion = ruta.features[0].properties.summary.duration; //segundos

  //   //THEN: El sistema muestra la distancia y duración de la ruta.
  //   expect(ruta).toBeTruthy();
  //   expect(trayectoria.length).toBeGreaterThan(0);

  //   const distanciaEsperada = 76000; // 76 km en metros
  //   expect(Math.abs(distancia - distanciaEsperada)).toBeLessThan(1000); //Margen de 1 km

  //   const duracionEsperada = 3600; //1 hora en segundos
  //   expect(Math.abs(duracion - duracionEsperada)).toBeLessThan(300); //Margen de 5 minutos

    
  //   await servicioPlace.deletePlace(lugar1.idPlace);
  //   await servicioPlace.deletePlace(lugar2.idPlace);
  //   await servicioPlace.deletePlace(lugar3.idPlace);

  //   await servicioUsuario.logoutUser();
  // });

  // it('HU13E03. Método de movilidad no válido (Escenario Inválido)', async () => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”].
  //   await servicioUsuario.loginUser("test@test.com", "test123");
  //   const lugar1 = await servicioPlace.createPlaceT("València, España");
  //   const lugar2 = await servicioPlace.createPlaceT("Castellón de la Plana");
  //   const lugar3 = await servicioPlace.createPlaceT("Alicante");

  //   try{
  //       //WHEN: El usuario solicita el calculo con “Valencia-Castellón” y en avión.
  //       try {
  //         await servicioRutas.calcularRuta(lugar1, lugar2, "plane");
  //       } catch(error){
  //         //THEN: El sistema lanza la excepción IncorrectMethodException()
  //         expect(error).toBeInstanceOf(IncorrectMethodException);
  //       }
  //   } finally{
  //     await servicioPlace.deletePlace(lugar1.idPlace);
  //     await servicioPlace.deletePlace(lugar2.idPlace);
  //     await servicioPlace.deletePlace(lugar3.idPlace);
  //     await servicioUsuario.logoutUser();
  //   }
    
  // });

  it('H14E01. Cálculo del coste asociado a la realización de una ruta en coche (Escenario Válido): ', async () => {
    //GIVEN:  La API está disponible. El usuario [“RouteTest”, “routetest@test.com“,“test123”] con listaVehículos= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”*407”, Año Fabricación=”2007”, Consumo=8,1, “Precio Gasoleo A”}]
    await servicioUsuario.loginUser("test@test.com", "test123"); 
    
    //const vehiculo = await servicioVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina");
    //const vehiculo = await servicioVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Diésel");
    const vehiculo = await servicioVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Eléctrico");


    //WHEN: El usuario quiere saber el coste de una ruta con unos de sus vehículos de tipo coche para saber cuánto dinero le va a costar y se selecciona el vehículo [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”*407”, Año Fabricación=”2007”, Consumo=8,1, “Precio Gasoleo A”] para la ruta [Origen:Valencia, Destino:Castellón].
    const ruta = new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90, false);
    
    //THEN: El sistema obtiene el combustible y se realiza el cálculo del coste total del viaje. * Coste: 90km/100 * 8,1L * 1.40€ = 10,21€

    const costeRuta = await servicioRutas.obtenerCosteRuta(vehiculo, ruta);
    expect(costeRuta).toBeTruthy();
    await servicioVehiculo.eliminarVehiculo(vehiculo.getMatricula());
    await servicioUsuario.logoutUser();
  });


  // it('H14E04. Cálculo del coste asociado a la realización de una ruta en coche utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
  //   //GIVEN: La API está disponible. El usuario [“RouteTest”, “routetest@test.com“,“test123”] con listaVehículos= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”*407”, Año Fabricación=”2007”, Consumo=8,1, “Precio Gasoleo A”}]
  //   await servicioUsuario.loginUser("test@test.com", "test123"); 
  //   const vehiculo = await servicioVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A');
    
  //   //WHEN: El usuario selecciona el vehículo [Matrícula=”1234 CCC”, Marca=”Peugeot”, Modelo=”*407”, Año Fabricación=”2007”, Consumo=8,1, “Precio Gasoleo A”]  y la ruta [Origen:Valencia, Destino:Castellón]
  //   const ruta = new Route('ruta01','Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90, false);
  //   const vehiculoNoExiste = new CocheDiesel("1234 CCC", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A', false);

  //   //THEN: El sistema no obtiene el coste y genera una excepción NotExistingObjectException().
  //   await expectAsync(servicioRutas.obtenerCosteRuta(vehiculoNoExiste, ruta)).toBeRejectedWith(new NotExistingObjectException());
  //   await servicioVehiculo.eliminarVehiculo(vehiculo.getMatricula());
  //   await servicioUsuario.logoutUser();
  // });

  // it('HU15E01. Cálculo de coste calórico de la ruta Valencia-Castellón (Escenario Válido)', async () => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] tiene su sesión iniciada y la base de datos está disponible. Lista lugares = [Valencia, Castellón]
  //   await servicioUsuario.loginUser("test@test.com", "test123");
  //   const origen = await servicioPlace.createPlaceT("València, España");
  //   const destino = await servicioPlace.createPlaceT("Castellón de la Plana");

  //   //WHEN: Se calcula el coste de la ruta Valencia-Castellón con la opción bicicleta. 
  //   const ruta = await servicioRutas.createRoute("Valencia-Castellón", origen, destino, "cycling-regular", "economica", 76, 15806);

  //   const coste = await servicioRutas.costeRutaPieBicicleta(ruta, origen, destino);
    
  //   //THEN: El sistema calcula el tiempo que se tarda en realizar la ruta prevista. El coste es de 500 calorías.
  //   const costeEsperado = '2195.28';
  //   expect(coste.toFixed(2)).toEqual(costeEsperado);

  //   await servicioPlace.deletePlace(origen.getIdPlace());
  //   await servicioPlace.deletePlace(destino.getIdPlace());
  //   await servicioRutas.deleteRoute("Valencia-Castellón");
  //   await servicioUsuario.logoutUser();
  // });

  
  // it('HU15E03. Intento de cálculo de gasto calórico pero no hay rutas dadas de alta (Escenario Inválido)', async () => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] tiene su sesión iniciada y la base de datos está disponible. Lista lugares = [Valencia, Castellón]
  //   await servicioUsuario.loginUser("test@test.com", "test123");
  //   const origen = await servicioPlace.createPlaceT("València, España");
  //   const destino = await servicioPlace.createPlaceT("Castellón de la Plana");

  //   try {
  //       //WHEN: El usuario RouteTest quiere realizar la ruta entre Valencia y Castellón en bicicleta.
  //       const ruta = new Route("Valencia-Castellón", "Valencia", "Castellón de la Plana", "economica", "cycling-regular", 76, 15806, false);
  //       await servicioRutas.costeRutaPieBicicleta(ruta, origen, destino);  
  //   } catch(error){
  //       //Then: El sistema no puede calcular el gasto calórico y lanza la excepción NoRouteFoundException()
  //       expect(error).toBeInstanceOf(NoRouteFoundException);
  //   }
  //   await servicioPlace.deletePlace(origen.getIdPlace());
  //   await servicioPlace.deletePlace(destino.getIdPlace());
  //   await servicioUsuario.logoutUser();
  // });

  // it('H16E01. Ruta más rápida/corta/económica calculada correctamente (Caso Válido)', async () => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] autenticado, lugares = [“Sagunto", “Castellón”].
  //   await servicioUsuario.loginUser("test@test.com", "test123");
  //   const place = await servicioPlace.createPlaceT("Sagunto");
  //   const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

  //   //WHEN: El usuario solicita el cálculo con “Valencia-Castellón” y el tipo de ruta más rápida.
  //   const result = await servicioRutas.getRouteFSE(place, place2, "driving-car", "fastest");

  //   //THEN: El sistema muestra la distancia y duración de la ruta más rápida.
  //   const resultArray = [result.features[0].properties.summary.distance / 1000, result.features[0].properties.summary.duration / 60];
  //   expect(resultArray).toEqual([52.863, 46.388333333333335]);
    
  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
  //   await servicioUsuario.logoutUser();
  // });

  // it('H16E02. Tipo de ruta no seleccionada (Caso Inválido)', async () => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] autenticado, lugares = [“Sagunto", “Castellón”].
  //   await servicioUsuario.loginUser("test@test.com", "test123");
  //   const place = await servicioPlace.createPlaceT("Sagunto");
  //   const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

  //   //WHEN: El usuario solicita el cálculo con “Valencia-Castellón” sin tipo de ruta.
  //   //THEN: El sistema lanza la excepción TypeNotChosenException().
  //   expect(() => servicioRutas.getRouteFSE(place, place2, "driving-car", "")).toThrow(new TypeNotChosenException());
    
  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
  //   await servicioUsuario.logoutUser();
  // });

  
  // it('H17E01. Guardar una ruta correctamente (Escenario válido):', async () => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] con la sesión de su cuenta activa, lugares = [“Sagunto", “Castellón”] y la lista de rutas = [ ]
  //   await servicioUsuario.loginUser("test@test.com", "test123");
  //   const place = await servicioPlace.createPlaceT("Sagunto");
  //   const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

  //   //WHEN: El usuario quiere añadir la siguiente ruta = {“ruta01”, “Sagunto”, “Castellón”, “driving-car”, “fastest”, 90, 60}.
  //   const result = await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "fastest", 90, 60);
    
  //   //THEN: El sistema guarda la ruta.
  //   expect(result).toBeInstanceOf(Route);
    
  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
  //   await servicioRutas.deleteRoute('ruta01');
  //   await servicioUsuario.logoutUser();
  // });

  // it('H17E02. Intento de guardar una ruta con lugares no registrados (Escenario inválido):', async () => {
  //   //GIVEN: El usuario  [“RouteTest”, “routetest@test.com“,“test123”] con la sesión de su cuenta activa, lugares = [“Sagunto", “Castellón”] y la lista de rutas = [ ]
  //   await servicioUsuario.loginUser("test@test.com", "test123");
  //   const place = await servicioPlace.createPlaceT("Sagunto");
  //   const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

  //   //WHEN: El usuario quiere añadir la siguiente ruta = {“ruta01”, “Madrid”, “Barcelona”, “driving-car”, “fastest”, 300, 150}.
  //   const placeAux: Place = new Place('005', 'Madrid', [], false);
  //   const placeAux2: Place = new Place('006', 'Barcelona', [], false);

  //   //THEN: El sistema lanza una excepción ServerNotOperativeException().
  //   await expectAsync(servicioRutas.createRoute('ruta01', placeAux, placeAux2, "driving-car", "fastest", 300, 150)).toBeRejectedWith(new NotExistingObjectException());
    
  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
  //   await servicioUsuario.logoutUser();
  // });

  // it('H18E01. Consultar rutas guardadas (Escenario Válido):', async() => {
  //   //GIVEN: El usuario  [“RouteTest”, “routetest@test.com“,“test123”] tiene iniciada su sesión. Lista de rutas guardadas = [{Origen: Sagunto, Destino: Alicante, driving-car, fastest, 90, 60}, {Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}]
  //   await servicioUsuario.loginUser("test@test.com","test123");
  //   const place = await servicioPlace.createPlaceT("Sagunto");
  //   const place2 = await servicioPlace.createPlaceT("Alicante");
  //   await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "fastest", 90, 60);

  //   const place3 = await servicioPlace.createPlaceT("Valencia");
  //   const place4 = await servicioPlace.createPlaceT("Castellón de la Plana");
  //   await servicioRutas.createRoute('ruta02', place3, place4, "driving-car", "shortest", 84, 64);

  // //WHEN: El usuario quiere consultar las rutas que tiene guardadas. 
  //   const rutas = await servicioRutas.getRoutes();

  // //THEN: El sistema muestra las rutas guardadas. Lista de rutas guardadas =  [{Origen: Sagunto, Destino: Alicante, driving-car, fastest, 90, 60}, {Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}] .
  //   expect(rutas.length).toBe(2);
  //   rutas.forEach((ruta: Route) => {
  //     expect(ruta).toBeInstanceOf(Route);
  //   });

  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
  //   await servicioRutas.deleteRoute('ruta01');

  //   await servicioPlace.deletePlace(place3.idPlace);
  //   await servicioPlace.deletePlace(place4.idPlace);
  //   await servicioRutas.deleteRoute('ruta02');

  //   await servicioUsuario.logoutUser();
  // });
  
  // it('H18E03. Intento de consulta de rutas guardadas pero el usuario no está registrado (Escenario Inválido):', async() => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] con lista de rutas guardadas = [{Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}]  no está iniciado en el sistema. 
  //   await servicioUsuario.loginUser("test@test.com","test123");
  //   const place = await servicioPlace.createPlaceT("Valencia");
  //   const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

  //   await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "shortest", 84, 64);
  //   await servicioUsuario.logoutUser();

  //   //WHEN: El usuario quiere consultar las rutas que tiene guardadas.
  //   //THEN: El sistema lanza una excepción ServerNotOperativeException().
  //   await expectAsync(servicioRutas.getRoutes()).toBeRejectedWith(new ServerNotOperativeException());

  //   await servicioUsuario.loginUser("test@test.com","test123");

  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
    
  //   await servicioRutas.deleteRoute('ruta01');

  //   await servicioUsuario.logoutUser();
  // });

  // it('H19E01. Eliminar una ruta que existe en el sistema (Escenario válido):', async() => {
  //   //GIVEN: El usuario [“RouteTest”, “routetest@test.com“,“test123”] con la sesión de su cuenta activa con lista de rutas guardadas = [{Nombre: ruta01, Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}].
  //   await servicioUsuario.loginUser("test@test.com","test123");
  //   const place = await servicioPlace.createPlaceT("Valencia");
  //   const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");
  //   await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "shortest", 84, 64);

  //   //WHEN: El usuario quiere eliminar la ruta ruta01.
  //   await servicioRutas.deleteRoute('ruta01');

  //   //THEN: El sistema borra la ruta y actualiza la lista de rutas = {}.
  //   const rutas = await servicioRutas.getRoutes();
  //   expect(rutas.length).toBe(0);

  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
  //   await servicioUsuario.logoutUser();
  // });

  // it('H19E04. Intento de eliminar una ruta sin estar registrado (Escenario inválido):', async() => {
  //   //GIVEN: El usuario [“Test”, “test@test.com“,“test123”] con lista de rutas guardadas = [{Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}]  no está iniciado en el sistema. 
  //   await servicioUsuario.loginUser("test@test.com","test123");
  //   const place = await servicioPlace.createPlaceT("Valencia");
  //   const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");
  //   await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "shortest", 84, 64);
    
  //   //WHEN: El usuario quiere consultar las rutas que tiene guardadas sin estar registrado.
  //   await servicioUsuario.logoutUser();
  //   //THEN: El sistema lanza una excepción ServerNotOperativeException().
  //   await expectAsync(servicioRutas.deleteRoute('ruta01')).toBeRejectedWith(new ServerNotOperativeException());

  //   await servicioUsuario.loginUser("test@test.com","test123");
  //   await servicioPlace.deletePlace(place.idPlace);
  //   await servicioPlace.deletePlace(place2.idPlace);
  //   await servicioRutas.deleteRoute('ruta01');
  //   await servicioUsuario.logoutUser();
  // });
});

  


