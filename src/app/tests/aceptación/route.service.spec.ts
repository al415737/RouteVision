import { TestBed } from '@angular/core/testing';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { Vehiculo } from '../../modelos/vehiculo';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../app.config';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { UserService } from '../../servicios/user.service';
import { USER_REPOSITORY_TOKEN } from '../../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { RouteService } from '../../servicios/route.service';
import { ROUTE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/route-repository';
import { RouteFirebaseService } from '../../repositorios/firebase/route-firebase.service';
import { PlaceService } from '../../servicios/place.service';
import { PLACE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/place-repository';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { provideHttpClient } from '@angular/common/http';
import { PrecioCarburantes } from '../../APIs/PrecioCarburantes/precioCarburantes.service';
import { Route } from '../../modelos/route';


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

  it('E01. Cálculo del coste asociado a la realización de una ruta en coche (Escenario Válido): ', async () => {
    // Given: La API está disponible. El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”*407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}]; listaRutas = [{Origen:Valencia, Destino:Castellón, Trayectoria: [Cabanyal, Sagunt, Almenara, Nules, Vilareal], kilómetros = 90}]. 
    await servicioUsuario.loginUser("test@test.com", "test123"); 
    const vehiculo = await serviceVehiculo.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);

    //crear ruta 
    const ruta = new Route('"VALENCIA / VALÈNCIA"', "CASTELLÓN / CASTELLÓ", ['Valencia', 'Cabanyal', 'Sagunt', 'Almenara', 'Nules', 'Vilareal', 'Castellón de la Plana'], 90);

    // When: El usuario quiere saber el coste de una ruta con unos de sus vehículos de tipo coche para saber cuánto dinero le va a costar y se selecciona el vehículo [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}], Año Fabricación=”2007”, Consumo=8,1L/100 km]  y la ruta [Origen:Valencia, Destino:Castellón, Trayectoria: [Cabanyal, Sagunt, Almenara, Nules, Vilareal], kilómetros = 90].
    const hola = await servicioRutas.obtenerCosteRuta(vehiculo, ruta);
    //console.log('precios' + hola);
    serviceVehiculo.eliminarVehiculo(vehiculo.getMatricula());
    expect(hola).toBeTruthy();
  });
});

