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
import { Vehiculo } from '../../modelos/vehiculo';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoService } from '../../servicios/vehiculo.service';


describe('RutasService', () => {
  let serviceVehiculo: VehiculoService;
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
    serviceVehiculo = TestBed.inject(VehiculoService);
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

    const lugar1 = await servicioPlace.createPlaceT("Valencia");
    const lugar2 = await servicioPlace.createPlaceT("Castellón");
    const lugar3 = await servicioPlace.createPlaceT("Alicante");

    serviceVehiculo.crearVehiculo("0987 CPK", "Peugeot", "407", "2004", 8.1);
    serviceVehiculo.crearVehiculo("8179 KLL", "BWM", "R 1250 RT", "2023", 4.8);

    //When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche1”.
    const ruta = await servicioRutas.calcularRuta("Valencia", "Castellon de la Plana", "driving-car");
    
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

    serviceVehiculo.eliminarVehiculo("0987 CPK");
    serviceVehiculo.eliminarVehiculo("8179 KLL");
    servicioUsuario.logoutUser();

  });

  it('HU13E03. Método de movilidad no válido (Escenario Inválido)', async () => {
    // Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], vehículos = [“Coche1”, “Moto1”, “Bicicleta1”].
    servicioUsuario.loginUser("test@test.com", "test123");

    const lugar1 = await servicioPlace.createPlaceT("Valencia");
    const lugar2 = await servicioPlace.createPlaceT("Castellón");
    const lugar3 = await servicioPlace.createPlaceT("Alicante");

    serviceVehiculo.crearVehiculo("0987 CPK", "Peugeot", "407", "2004", 8.1);
    serviceVehiculo.crearVehiculo("8179 KLL", "BWM", "R 1250 RT", "2023", 4.8);

    try{
        // When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche2”.
        try {
          await servicioRutas.calcularRuta("Valencia", "Castellón de la Plana", "Coche2");
        } catch(error){
          //Then: El sistema lanza la excepción VehicleNotFoundException().
          expect(error).toBeInstanceOf(VehicleNotFoundException);
        }
    } finally{
      servicioPlace.deletePlace(lugar1.idPlace);
      servicioPlace.deletePlace(lugar2.idPlace);
      servicioPlace.deletePlace(lugar3.idPlace);

      serviceVehiculo.eliminarVehiculo("0987 CPK");
      serviceVehiculo.eliminarVehiculo("8179 KLL");
      servicioUsuario.logoutUser();
    }
    
  });

  it('H14-E01. Cálculo del coste asociado a la realización de una ruta en coche (Escenario Válido): ', async () => {
  // Given: 
  await servicioUsuario.loginUser("test@test.com", "test123"); 
  const vehiculo = await serviceVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);

  const ruta = new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90);

  const costeRuta = await servicioRutas.obtenerCosteRuta(vehiculo, ruta);
  serviceVehiculo.eliminarVehiculo(vehiculo.getMatricula());
  expect(costeRuta).toBeTruthy();
  });

  it('H14-E04. Cálculo del coste asociado a la realización de una ruta en coche utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
  await servicioUsuario.loginUser("test@test.com", "test123"); 
  const vehiculo = await serviceVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
  // const vehiculoNoExiste = await serviceVehiculo.crearVehiculo("3423 WCX", "Fiat", "Punto", "2016", 8.1); //este vehículo NO EXISTE EN LA BBDD DEL USUARIO
  const ruta = new Route('Valencia', 'Castellón de la Plana/Castelló de la Plana', ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90);
  const vehiculoNoExiste = new Vehiculo("3423 WCX", "Fiat", "Punto", "2016", 8.1);

  await expectAsync(servicioRutas.obtenerCosteRuta(vehiculoNoExiste, ruta)).toBeRejectedWith(new NotExistingObjectException());
  serviceVehiculo.eliminarVehiculo(vehiculo.getMatricula());
  servicioUsuario.logoutUser();
  // serviceVehiculo.eliminarVehiculo(vehiculoNoExiste.getMatricula());
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
});

//   it('E01. Cálculo de ruta entre dos pu90ntos de interés (Escenario Válido)', async () => {
//         //Given: El Usuario  [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], 
//                 // vehículos = [“Coche1”, “Moto1”] .
//                 /*
//         servicioUsuario.loginUser("test@test.com", "test123");

//         const lugar1 = await servicioPlace.createPlaceT("Valencia");
//         const lugar2 = await servicioPlace.createPlaceT("Castellón");
//         const lugar3 = await servicioPlace.createPlaceT("Alicante");

//         serviceVehiculo.crearVehiculo("0987 CPK", "Peugeot", "407", "2004", 8.1);
//         serviceVehiculo.crearVehiculo("8179 KLL", "BWM", "R 1250 RT", "2023", 4.8);
//         */

//         //When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche1”.
//         const ruta = servicioRutas.calcularRuta("Valencia", "Castellón", "Coche");
//         console.log("Ruta:" + ruta);

//         /*
//         //Then: El sistema muestra Trayecto=[Valencia, Paterna, Puzol, Sagunto, Moncófar, Villareal, Castellon], distancia=84km, duración=1h.
//         servicioPlace.deletePlace(lugar1.idPlace);
//         servicioPlace.deletePlace(lugar2.idPlace);
//         servicioPlace.deletePlace(lugar3.idPlace);

//         serviceVehiculo.eliminarVehiculo("0987 CPK");
//         serviceVehiculo.eliminarVehiculo("8179 KLL");
//         */
