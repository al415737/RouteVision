
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
import { openRouteService } from '../../APIs/Geocoding/openRoute.service';
import { provideHttpClient } from '@angular/common/http';

  describe('RutasService', () => {
  let serviceVehiculo: VehiculoService;
  let servicioUsuario: UserService;
  let servicioRutas: RouteService;
  let servicioPlace: PlaceService;
  let openRoute: openRouteService;

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
    openRoute = TestBed.inject(openRouteService);
  });

  it('E01. Cálculo de ruta entre dos puntos de interés (Escenario Válido)', async () => {
        //Given: El Usuario  [“Ana2002”, “anita@gmail.com“,“aNa-24”] autenticado, lugares = [“Valencia”, “Castellón”, “Alicante”], 
                // vehículos = [“Coche1”, “Moto1”] .
                /*
        servicioUsuario.loginUser("test@test.com", "test123");

        const lugar1 = await servicioPlace.createPlaceT("Valencia");
        const lugar2 = await servicioPlace.createPlaceT("Castellón");
        const lugar3 = await servicioPlace.createPlaceT("Alicante");

        serviceVehiculo.crearVehiculo("0987 CPK", "Peugeot", "407", "2004", 8.1);
        serviceVehiculo.crearVehiculo("8179 KLL", "BWM", "R 1250 RT", "2023", 4.8);
        */

        //When: El usuario solicita el calculo con “Valencia-Castellón” y vehículo “Coche1”.
        const ruta = await servicioRutas.calcularRuta("Valencia", "Castellon de la Plana", "driving-car");
        
        const trayectoria = ruta.features[0].properties.geometry.coordinates;
        const distancia = ruta.features[0].properties.summary.distance; //metros
        const duracion = ruta.features[0].properties.summary.duration; //segundos

        expect(ruta).toBeTruthy();
        //expect(trayectoria.length).toBeGreatherThan(0);

        const distanciaEsperada = 76000;
        //expect(Math.abs(distancia - distanciaEsperada)).toBeLessThan(1000);

        

        console.log(ruta);

        /*
        //Then: El sistema muestra Trayecto=[Valencia, Paterna, Puzol, Sagunto, Moncófar, Villareal, Castellon], distancia=84km, duración=1h.
        servicioPlace.deletePlace(lugar1.idPlace);
        servicioPlace.deletePlace(lugar2.idPlace);
        servicioPlace.deletePlace(lugar3.idPlace);

        serviceVehiculo.eliminarVehiculo("0987 CPK");
        serviceVehiculo.eliminarVehiculo("8179 KLL");
        */

  });

});
