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

  it('HU13E01. Cálculo de ruta entre dos puntos de interés (Escenario Válido)', async () => {
    //Given: El Usuario  [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], 
            // vehículos = [“Coche1”, “Moto1”] .
    servicioUsuario.loginUser("test@test.com", "test123");

    const lugar1 = await servicioPlace.createPlaceT("València, España");
    const lugar2 = await servicioPlace.createPlaceT("Castellón de la Plana");
    const lugar3 = await servicioPlace.createPlaceT("Alicante");

    await servicioVehiculo.crearVehiculo("0987 CPK", "Peugeot", "407", "2004", 8.1, "Precio Gasoleo A");  
    await servicioVehiculo.crearVehiculo("8179 KLL", "BWM", "R 1250 RT", "2023", 4.8, "Precio Gasolina 95 E5");

    //When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche1”.
    const ruta = await servicioRutas.calcularRuta(lugar1, lugar2, "driving-car");
    
    const trayectoria = ruta.features[0].geometry.coordinates;      //coordenadas de toda la trayectoria
    const distancia = ruta.features[0].properties.summary.distance; //metros
    const duracion = ruta.features[0].properties.summary.duration; //segundos

    expect(ruta).toBeTruthy();
    expect(trayectoria.length).toBeGreaterThan(0);

    const distanciaEsperada = 76000; // 76 km en metros
    expect(Math.abs(distancia - distanciaEsperada)).toBeLessThan(1000); //Margen de 1 km

    const duracionEsperada = 3600; //1 hora en segundos
    expect(Math.abs(duracion - duracionEsperada)).toBeLessThan(300); //Margen de 5 minutos

    //Then: El sistema muestra Trayecto=[Valencia, Paterna, Puzol, Sagunto, Moncófar, Villareal, Castellon], distancia=84km, duración=1h.
    servicioPlace.deletePlace(lugar1.idPlace);
    servicioPlace.deletePlace(lugar2.idPlace);
    servicioPlace.deletePlace(lugar3.idPlace);

    servicioVehiculo.eliminarVehiculo("0987 CPK");
    servicioVehiculo.eliminarVehiculo("8179 KLL");
    servicioUsuario.logoutUser();

  });

  it('HU13E03. Método de movilidad no válido (Escenario Inválido)', async () => {
    // Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], vehículos = [“Coche1”, “Moto1”, “Bicicleta1”].
    servicioUsuario.loginUser("test@test.com", "test123");

    const lugar1 = await servicioPlace.createPlaceT("València, España");
    const lugar2 = await servicioPlace.createPlaceT("Castellón de la Plana");
    const lugar3 = await servicioPlace.createPlaceT("Alicante");

    await servicioVehiculo.crearVehiculo("0987 CPK", "Peugeot", "407", "2004", 8.1, "Precio Gasoleo A");  
    await servicioVehiculo.crearVehiculo("8179 KLL", "BWM", "R 1250 RT", "2023", 4.8, "Precio Gasolina 95 E5");

    try{
        // When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche2”.
        try {
          await servicioRutas.calcularRuta(lugar1, lugar2, "Coche2");
        } catch(error){
          //Then: El sistema lanza la excepción VehicleNotFoundException().
          expect(error).toBeInstanceOf(IncorrectMethodException);
        }
    } finally{
      servicioPlace.deletePlace(lugar1.idPlace);
      servicioPlace.deletePlace(lugar2.idPlace);
      servicioPlace.deletePlace(lugar3.idPlace);

      servicioVehiculo.eliminarVehiculo("0987 CPK");
      servicioVehiculo.eliminarVehiculo("8179 KLL");
      servicioUsuario.logoutUser();
    }
    
  });

  it('H14-E01. Cálculo del coste asociado a la realización de una ruta en coche (Escenario Válido): ', async () => {
    await servicioUsuario.loginUser("test@test.com", "test123"); 

    const vehiculo = await servicioVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A');
    
    const ruta = new Route('ruta01', 'Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90, false);
    
    const costeRuta = await servicioRutas.obtenerCosteRuta(vehiculo, ruta);
    servicioVehiculo.eliminarVehiculo(vehiculo.getMatricula());
    expect(costeRuta).toBeTruthy();
  });


  it('H14-E04. Cálculo del coste asociado a la realización de una ruta en coche utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
    await servicioUsuario.loginUser("test@test.com", "test123"); 
    
    const vehiculo = await servicioVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A');
    // const vehiculoNoExiste = await serviceVehiculo.crearVehiculo("3423 WCX", "Fiat", "Punto", "2016", 8.1); //este vehículo NO EXISTE EN LA BBDD DEL USUARIO
    const ruta = new Route('ruta01','Valencia', 'Castellón de la Plana/Castelló de la Plana', 'porDefecto', 'driving-car', 90, 90, false);
    const vehiculoNoExiste = new CocheDiesel("3423 WCX", "Fiat", "Punto", "2016", 8.1,'Precio Gasoleo A', false);

    await expectAsync(servicioRutas.obtenerCosteRuta(vehiculoNoExiste, ruta)).toBeRejectedWith(new NotExistingObjectException());
    servicioVehiculo.eliminarVehiculo(vehiculo.getMatricula());
    servicioUsuario.logoutUser();
  });

  it('H16E01. Ruta más rápida/corta/económica calculada correctamente (Caso Válido)', async () => {
    await servicioUsuario.loginUser("test@test.com", "test123");
    const place = await servicioPlace.createPlaceT("Sagunto");
    const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

    const result = await servicioRutas.getRouteFSE(place, place2, "driving-car", "fastest");
    const resultArray = [result.features[0].properties.summary.distance / 1000, result.features[0].properties.summary.duration / 60];
    expect(resultArray).toEqual([52.863, 46.388333333333335]);
    
    await servicioPlace.deletePlace(place.idPlace);
    await servicioPlace.deletePlace(place2.idPlace);
    await servicioUsuario.logoutUser();
  });

  it('H16E02. Tipo de ruta no seleccionada (Caso Inválido)', async () => {
    await servicioUsuario.loginUser("test@test.com", "test123");
    const place = await servicioPlace.createPlaceT("Sagunto");
    const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

    expect(() => servicioRutas.getRouteFSE(place, place2, "driving-car", "")).toThrow(new TypeNotChosenException());
    
    await servicioPlace.deletePlace(place.idPlace);
    await servicioPlace.deletePlace(place2.idPlace);
    await servicioUsuario.logoutUser();
  });

  it('HU15E01. Cálculo de coste calórico de la ruta Valencia-Castellón (Escenario Válido)', async () => {
    //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“ppt-24”] tiene su sesión iniciada y la base de datos está disponible. Lista rutas: [ {nombre: Valencia-Castellón, Origen:Valencia, Destino:Castellón de la Plana, Opción: economica, Movilidad: cycling-regular, kilómetros = 76, duracion = 15806}]
    servicioUsuario.loginUser("test@test.com", "test123");
    const origen = await servicioPlace.createPlaceT("València, España");
    const destino = await servicioPlace.createPlaceT("Castellón de la Plana");
    const ruta = await servicioRutas.createRoute("Valencia-Castellón", origen, destino, "cycling-regular", "economica", 76, 15806);

    //When: Se calcula el coste de la ruta Valencia-Castellón con la opción bicicleta. 
    const coste = await servicioRutas.costeRutaPieBicicleta(ruta, origen, destino);
    
    //Then: El sistema calcula el tiempo que se tarda en realizar la ruta prevista que son 4 horas. El coste es de 500 calorías (1 hora) * 4,39 horas = 2195.28 calorías
    const costeEsperado = '2195.28';
    expect(coste.toFixed(2)).toEqual(costeEsperado);

    await servicioPlace.deletePlace(origen.getIdPlace());
    await servicioPlace.deletePlace(destino.getIdPlace());
    await servicioRutas.deleteRoute("Valencia-Castellón");
    servicioUsuario.logoutUser();
  });

  
  it('HU15E03. Intento de cálculo de gasto calórico pero no hay rutas dadas de alta (Escenario Inválido)', async () => {
    //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“crm-24”] ha iniciado sesión y la base de datos está disponible. Lista rutas = []  
    servicioUsuario.loginUser("test@test.com", "test123");
    const origen = await servicioPlace.createPlaceT("València, España");
    const destino = await servicioPlace.createPlaceT("Castellón de la Plana");
    const ruta = new Route("Valencia-Castellón", "Valencia", "Castellón de la Plana", "economica", "cycling-regular", 76, 15806, false);

    try {
        //When: El usuario Pepito quiere realizar la ruta entre Valencia y Castellón en bicicleta.
        await servicioRutas.costeRutaPieBicicleta(ruta, origen, destino);  
    } catch(error){
        //Then: El sistema no puede calcular el gasto calórico y lanza la excepción NoRouteFoundException()
        expect(error).toBeInstanceOf(NoRouteFoundException);
    }
  });
  
  it('H17E01. Guardar una ruta que no existe en el sistema (Escenario válido)', async () => {
    await servicioUsuario.loginUser("test@test.com", "test123");
    const place = await servicioPlace.createPlaceT("Sagunto");
    const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

    const result = await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "fastest", 90, 60);
    expect(result).toBeInstanceOf(Route);
    
    await servicioPlace.deletePlace(place.idPlace);
    await servicioPlace.deletePlace(place2.idPlace);
    await servicioRutas.deleteRoute('ruta01');
    await servicioUsuario.logoutUser();
  });

  it('H17E02. Intento de guardar una ruta con lugares no registrados (Escenario inválido)', async () => {
    await servicioUsuario.loginUser("test@test.com", "test123");
    const place = await servicioPlace.createPlaceT("Sagunto");
    const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");

    const placeAux: Place = new Place('005', 'Madrid', [], false);
    const placeAux2: Place = new Place('006', 'Barcelona', [], false);

    await expectAsync(servicioRutas.createRoute('ruta01', placeAux, placeAux2, "driving-car", "fastest", 90, 60)).toBeRejectedWith(new NotExistingObjectException());
    
    await servicioPlace.deletePlace(place.idPlace);
    await servicioPlace.deletePlace(place2.idPlace);
    await servicioRutas.deleteRoute('ruta01');
    await servicioUsuario.logoutUser();
  });

  it('H18E01. Consultar rutas guardadas (Escenario Válido):', async() => {
      //  GIVEN: El usuario [“Test”, “test@test.com“,“test123”] tiene iniciada su sesión. Lista de rutas guardadas = [{Origen: Sagunto, Destino: Alicante, driving-car, fastest, 90, 60}, {Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}].
          await servicioUsuario.loginUser("test@test.com","test123");
          const place = await servicioPlace.createPlaceT("Sagunto");
          const place2 = await servicioPlace.createPlaceT("Alicante");
          await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "fastest", 90, 60);

          const place3 = await servicioPlace.createPlaceT("Valencia");
          const place4 = await servicioPlace.createPlaceT("Castellón de la Plana");
          await servicioRutas.createRoute('ruta02', place3, place4, "driving-car", "shortest", 84, 64);
  
      //WHEN: El usuario Test quiere consultar las rutas que tiene guardadas.
          const rutas = await servicioRutas.getRoutes();
  
      //THEN: El sistema muestra las rutas guardadas. Lista de rutas guardadas =  [{Origen: Sagunto, Destino: Alicante, driving-car, fastest, 90, 60}, {Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}] .
          expect(rutas.length).toBe(2);
  
          rutas.forEach((ruta: Route) => {
            expect(ruta).toBeInstanceOf(Route);
        });
  
        await servicioPlace.deletePlace(place.idPlace);
        await servicioPlace.deletePlace(place2.idPlace);
        await servicioRutas.deleteRoute('ruta01');
        await servicioPlace.deletePlace(place3.idPlace);
        await servicioPlace.deletePlace(place4.idPlace);
        await servicioRutas.deleteRoute('ruta02');
        await servicioUsuario.logoutUser();
  });
  
  it('H18E03. Intento de consulta de rutas guardadas pero el usuario no está registrado (Escenario Inválido):', async() => {
    //GIVEN: El usuario [“Test”, “test@test.com“,“test123”] con lista de rutas guardadas = [{Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}]  no está iniciado en el sistema. 
      await servicioUsuario.loginUser("test@test.com","test123");
      const place = await servicioPlace.createPlaceT("Valencia");
      const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");
      await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "shortest", 84, 64);
      await servicioUsuario.logoutUser();
    //WHEN: El usuario quiere consultar las rutas que tiene guardadas.
    //THEN: El sistema lanza una excepción ServerNotOperativeException().
      await expectAsync(servicioRutas.getRoutes()).toBeRejectedWith(new ServerNotOperativeException());

      await servicioUsuario.loginUser("test@test.com","test123");
      await servicioPlace.deletePlace(place.idPlace);
      await servicioPlace.deletePlace(place2.idPlace);
      await servicioRutas.deleteRoute('ruta01');
      await servicioUsuario.logoutUser();
  });

  it('H19E01. Eliminar una ruta que existe en el sistema (Escenario válido):', async() => {
    //  GIVEN: El usuario [“Test”, “test@test.com“,“test123”] con la sesión de su cuenta activa con lista de rutas guardadas = [{Nombre: ruta01, Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}].
        await servicioUsuario.loginUser("test@test.com","test123");
        const place = await servicioPlace.createPlaceT("Valencia");
        const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");
        await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "shortest", 84, 64);

    //WHEN: El usuario quiere eliminar la ruta ruta01.
        await servicioRutas.deleteRoute('ruta01');

    //THEN: El sistema borra la ruta y actualiza la lista de rutas = {}.
        const rutas = await servicioRutas.getRoutes();
        expect(rutas.length).toBe(0);

        await servicioPlace.deletePlace(place.idPlace);
        await servicioPlace.deletePlace(place2.idPlace);
        await servicioUsuario.logoutUser();
  });

  it('H19E04. Intento de eliminar una ruta sin estar registrado (Escenario inválido):', async() => {
    //GIVEN: El usuario [“Test”, “test@test.com“,“test123”] con lista de rutas guardadas = [{Origen: Valencia, Destino: Castellón, driving-car, shortest, 84, 64}]  no está iniciado en el sistema. 
    await servicioUsuario.loginUser("test@test.com","test123");
    const place = await servicioPlace.createPlaceT("Valencia");
    const place2 = await servicioPlace.createPlaceT("Castellón de la Plana");
    await servicioRutas.createRoute('ruta01', place, place2, "driving-car", "shortest", 84, 64);
  //WHEN: El usuario quiere consultar las rutas que tiene guardadas.
  //THEN: El sistema lanza una excepción ServerNotOperativeException().
    await servicioUsuario.logoutUser();
    await expectAsync(servicioRutas.deleteRoute('ruta01')).toBeRejectedWith(new ServerNotOperativeException());

    await servicioUsuario.loginUser("test@test.com","test123");
    await servicioPlace.deletePlace(place.idPlace);
    await servicioPlace.deletePlace(place2.idPlace);
    await servicioRutas.deleteRoute('ruta01');
    await servicioUsuario.logoutUser();
});
});

  


