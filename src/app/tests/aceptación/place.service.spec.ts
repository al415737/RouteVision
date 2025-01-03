import { TestBed } from '@angular/core/testing';
import { PlaceService } from '../../servicios/place.service';
import { UserService } from '../../servicios/user.service';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../../app.config';
import { PLACE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/place-repository';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { USER_REPOSITORY_TOKEN } from '../../repositorios/interfaces/user-repository';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { FirestoreService } from '../../repositorios/firebase/firestore.service';
import { provideHttpClient } from '@angular/common/http';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';
import { Place } from '../../modelos/place';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';
import { MapComponent } from '../../componentes/map/map.component';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';


describe('PlaceService', () => {
  let servicePlace: PlaceService;
  let serviceUser: UserService;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Configuración moderna para HttpClient
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        PlaceService,
        { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService },
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService },
        FirestoreService,
        MapComponent
      ] 
    })

    servicePlace = TestBed.inject(PlaceService);
    serviceUser = TestBed.inject(UserService);
  });
  

  it('HU5E01. Registrar nuevo lugar de interés (Caso Válido):', async () => {
    // GIVEN: El usuario [“PlaceTest”, “placetest@test.com“,“test123”] quiere dar de alta un nuevo lugar de interés.
    // La API está disponible → lugaresInteres= [ ].
    await serviceUser.loginUser("test@test.com", "test123"); 
    
    // WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 39.98, Longitud: -0.049]
    const createPlace = await servicePlace.createPlaceC([39.98, -0.049]);

    // THEN:  El sistema registra el lugar de interés de PlaceTest.
    // lugaresInteres = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], municipio = "Castellón"}, idLugar = “000”}.
    expect(createPlace).toBeInstanceOf(Place);
    expect(createPlace.idPlace).toBeDefined(); 
    await servicePlace.deletePlace(createPlace.idPlace);
    await serviceUser.logoutUser();
  });

  it('HU5E02. Registro de un lugar de interés incorrecto (Caso Inválido):', async () => {
    // GIVEN: El usuario [“PlaceTest”, “placetest@test.com“,“test123”] quiere dar de alta un nuevo lugar de interés.
    // La API está disponible → lugaresInteres= [ ].
    await serviceUser.loginUser("test@test.com", "test123");

    try{
      // WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 899,98, Longitud:].
      await servicePlace.createPlaceC([899.98, ]);
    } catch (error){  
      // THEN: El sistema no registra el lugar de interés y lanza la excepción InvalidCoordinatesException().
      expect(error).toBeInstanceOf(InvalidCoordenatesException);
    }
    await serviceUser.logoutUser();
  });

  //HISTORIA 6 -------------------------------------
  it('HU6E01. Registro de lugar de interés con un topónimo correcto (Escenario Válido):', async () => {
    // La API está disponible y el usuario [“PlaceTest”, “placetest@test.com“,“test123”] tiene en su base de datos
    // la lista → listaLugaresInteres = [{NombreCiudad = “Castelló de la Plana”,
    // Coordenadas = [Latitud: 39.98, Longitud: -0.049],  idLugar = “000”, municipio = "Castellón"}.  
    await serviceUser.loginUser("test@test.com", "test123"); 
    const place = await servicePlace.createPlaceT('Castellón de la Plana');

    // WHEN: Intenta dar de alta un lugar de interés → Topónimo = 'Bilbao'
    const createPlaceT = await servicePlace.createPlaceT('Bilbao');

    // THEN: El sistema registra el lugar de interés de lugaresInteres=
    // [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049] municipio = "Castellón"},
    // {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], municipio = "Bilbao"}].
    expect(createPlaceT).toBeInstanceOf(Place);
    expect(createPlaceT.idPlace).toBeDefined(); 
    await servicePlace.deletePlace(createPlaceT.idPlace);
    await servicePlace.deletePlace(place.idPlace);
    await serviceUser.logoutUser();
  });

  
  it('HU6E03. Registro de lugar de interés con un topónimo incorrecto (Escenario Inválido):', async () => {
    // El usuario [“PlaceTest”, “placetest@test.com“,“test123”] quiere dar de alta un nuevo lugar de interés.
    // La API está disponible → lugaresInteres= [{NombreCiudad = “Castelló de la Plana”,
    // Coordenadas = [Latitud: 39.98, Longitud: -0.049],  idLugar = “000”, municipio = "Castellón"}].   
    await serviceUser.loginUser("test@test.com", "test123");
    const place = await servicePlace.createPlaceT('Castellón de la Plana');
      
    // WHEN: Intenta dar de alta un lugar de interés → Topónimo = “Cassjdlftellfisonon”.      
    // THEN: El sistema no registra el lugar de interés y se genera la excepción InvalidPlaceException().
    await expectAsync(servicePlace.createPlaceT('Cassjdlftellfisonon'))
    .toBeRejectedWith(new InvalidPlaceException());
    await servicePlace.deletePlace(place.idPlace);
    await serviceUser.logoutUser();
  });

  it('HU7E01. Consulta de lista de lugares dados de alta (Escenario válido):', async() => {
    // GIVEN:  lugaresInteres = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”, municipio = “Castellón”},
    // {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”, municipio = “Bilbao”}]
    // se encuentra registrado. 
    await serviceUser.loginUser("test@test.com","test123");
    const lugar1 = await servicePlace.createPlaceC([39.98, -0.049]);
    const lugar2 = await servicePlace.createPlaceT("Bilbao");

    //WHEN: El usuario PlaceTest quiere consultar su lista de lugares.
    const lugares = await servicePlace.getPlaces();

    //THEN: El sistema le muestra la lista de lugares = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”}]. 
    expect(lugares.length).toBe(2);

    lugares.forEach((lugar: Place) => {
      expect(lugar).toBeInstanceOf(Place);
    });

    await servicePlace.deletePlace(lugar1.idPlace);
    await servicePlace.deletePlace(lugar2.idPlace);
    await serviceUser.logoutUser();
   });

   it('HU7E03. Consulta de lista de lugares dados de alta sin estar registrado:', async() => {
    //GIVEN: El usuario [“PlaceTest”, “placetest@test.com“,“test123”] con  lugaresInteres = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”, municipio = “Castellón”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”, municipio = “Bilbao”}] no se encuentra registrado. 
    await serviceUser.loginUser("test@test.com","test123");
    const lugar1 = await servicePlace.createPlaceC([39.98, -0.049]);
    const lugar2 = await servicePlace.createPlaceT("Bilbao");
    await serviceUser.logoutUser();
    //WHEN:  El usuario PlaceTest quiere consultar su lista de lugares..
    //THEN: El sistema lanza una excepción ServerNotOperativeException().
    await expectAsync(servicePlace.getPlaces()).toBeRejectedWith(new ServerNotOperativeException());
    await serviceUser.loginUser("test@test.com","test123");
    await servicePlace.deletePlace(lugar1.idPlace);
    await servicePlace.deletePlace(lugar2.idPlace);
    await serviceUser.logoutUser();
  });

  it('HU8E01. Eliminación de un lugar de interés de la lista de lugares de interés del usuario (Escenario Válido):', async() => {
    //GIVEN: El usuario [“PlaceTest”, “placetest@test.com“,“test123”] quiere eliminar uno de sus lugares de interés → lugaresInteres= [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar = “000”, municipio = “Castellón”}].
    await serviceUser.loginUser("test@test.com","test123");
    const lugar = await servicePlace.createPlaceC([39.98, -0.049]);

    //WHEN: Intenta eliminar un lugar de interés → [idLugar = “000”, Topónimo = “Castellón”].
    const result = await servicePlace.deletePlace(lugar.idPlace);

    //THEN: El sistema elimina el lugar de interés.
    expect(result).toEqual(true);
    await serviceUser.logoutUser();
   });

   it('HU8E02. Eliminación de un lugar de interés que no está en la lista de lugares de interés del usuario (Escenario Inválido):', async() => {
    //GIVEN: El usuario [“PlaceTest”, “placetest@test.com“,“test123”] quiere eliminar un lugar de interés que no está
    // en su lista de lugares de interés →  lugaresInteres= [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar = “000”, municipio = “Castellón”}].
    await serviceUser.loginUser("test@test.com","test123");
    const lugar = await servicePlace.createPlaceC([39.98, -0.049]);
    //WHEN: Intenta eliminar un lugar de interés → [idLugar = “001”, Topónimo = “Valencia”].
    //THEN: El sistema no elimina el lugar de interés y lanza la excepción PlaceNotFoundInListException().
    await expectAsync(servicePlace.deletePlace('001')).toBeRejectedWith(new NotExistingObjectException());
    await servicePlace.deletePlace(lugar.idPlace);
    await serviceUser.logoutUser();
   });
});
