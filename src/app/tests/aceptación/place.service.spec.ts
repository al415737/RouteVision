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
import { GeocodingService } from '../../APIs/Geocoding/geocoding.service';
import { FirestoreService } from '../../repositorios/firebase/firestore.service';
import { provideHttpClient } from '@angular/common/http';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';
import { Place } from '../../modelos/place';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';


describe('PlaceService', () => {
  let servicePlace: PlaceService;
  let serviceUser: UserService;
  let geocodinRepositorio: GeocodingService;

  beforeEach(() => {
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
      ] 
    })

    servicePlace = TestBed.inject(PlaceService);
    serviceUser = TestBed.inject(UserService);
    geocodinRepositorio = TestBed.inject(GeocodingService); 
  });
  

  it('HU5E01. Registrar nuevo lugar de interés (Caso Válido):', async () => {

    // GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
    await serviceUser.loginUser("test@test.com", "test123"); 
    /*spyOn(geocodinRepositorio, "getToponimo").and.returnValue(of({toponimo: 'Castellón de la Plana'}));
    
    const result = await firstValueFrom(geocodinRepositorio.getToponimo([39.98, -0.049]));
    expect(result).toEqual({toponimo: 'Castellón de la Plana'});*/

    // WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 39.98, Longitud: -0.049]
    const createPlace = await servicePlace.createPlaceC([39.98, -0.049]);

    // THEN: El sistema registra el lugar de interés de Ana2002. → placeListAna2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049]}, idLugar = “000”}.    
    expect(createPlace).toBeInstanceOf(Place);
    expect(createPlace.idPlace).toBeDefined(); 
    await servicePlace.deletePlace(createPlace.idPlace);
  });

  it('HU5E02. Registro de un lugar de interés incorrecto (Caso Inválido):', async () => {
    // GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
    await serviceUser.loginUser("test@test.com", "test123");

    try{
      // WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 899,98, Longitud:].
      await servicePlace.createPlaceC([899.98, ]);
    } catch (error){  
      // THEN: El sistema no registra el lugar de interés y lanza la excepción InvalidCoordinatesException().
      expect(error).toBeInstanceOf(InvalidCoordenatesException);
    }
  });

  //HISTORIA 6 -------------------------------------
  it('HU6E01. Registro de lugar de interés con un topónimo correcto (Escenario Válido):', async () => {

    // GIVEN: La API está disponible y el usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con
    // listaLugaresInteres-Ana2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud:
    // 39.98, Longitud: -0.049]}].      
    await serviceUser.loginUser("test@test.com", "test123"); 
    const place = await servicePlace.createPlaceT('Castellón de la Plana');

    // WHEN: Intenta dar de alta un lugar de interés → Topónimo = 'Bilbao'
    const createPlaceT = await servicePlace.createPlaceT('Bilbao');


    // THEN: El sistema registra el lugar de interés de Ana2002 → lugaresInteres-Ana2002=
    // [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049]},
    // {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528]}].      expect(createPlace).toBeInstanceOf(Place);
    expect(createPlaceT).toBeInstanceOf(Place);
    expect(createPlaceT.idPlace).toBeDefined(); 
    await servicePlace.deletePlace(createPlaceT.idPlace);
    await servicePlace.deletePlace(place.idPlace);

  });

  
  it('HU6E03. Registro de lugar de interés con un topónimo incorrecto (Escenario Inválido):', async () => {
    // GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de
    // interés. La API está disponible → lugaresInteres-Ana2002= [{NombreCiudad = “Castelló de la Plana”,
    // Coordenadas = [Latitud: 39.98, Longitud: -0.049]}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud:
    // 43.26271, Longitud: -2.92528]}].     
    await serviceUser.loginUser("test@test.com", "test123");
  
    const place = await servicePlace.createPlaceT('Castellón de la Plana');
    
    // WHEN: Intenta dar de alta un lugar de interés → Topónimo = “Cassjdlftellfisonon”.   
    // THEN: El sistem+a no registra el lugar de interés y se genera la excepción InvalidPlaceException().
    await expectAsync(servicePlace.createPlaceT('Cassjdlftellfisonon'))
    .toBeRejectedWith(new InvalidPlaceException());

    await servicePlace.deletePlace(place.idPlace);
  });

  it('HU7E01. Consulta de lista de lugares dados de alta (Escenario válido):', async() => {
    //  GIVEN: La API está disponible y el usuario [“Testito”, “test@test.com“,“test1234”] con  place = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”}].
        await serviceUser.loginUser("test@test.com","test123");
        const lugar1 = await servicePlace.createPlaceC([39.98, -0.049]);
        const lugar2 = await servicePlace.createPlaceT("Bilbao");

    //WHEN: El usuario Ana2002 quiere consultar su lista de lugares.
        const lugares = await servicePlace.getPlaces();

    //THEN: El sistema le muestra la lista de lugares = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”}].
        expect(lugares.length).toBe(2);

        lugares.forEach((lugar: Place) => {
          expect(lugar).toBeInstanceOf(Place);
      });

      await servicePlace.deletePlace(lugar1.idPlace);
      await servicePlace.deletePlace(lugar2.idPlace);
   });

   it('HU7E02. Consulta de lista de lugares dados de alta sin conexión a la BBDD (Escenario inválido):', async() => {
      //GIVEN:  El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con  listaLugaresInteres-Ana2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”}] no se encuentra registrado.
      await serviceUser.loginUser("test@test.com","test123");
      const lugar1 = await servicePlace.createPlaceC([39.98, -0.049]);
      const lugar2 = await servicePlace.createPlaceT("Bilbao");
      await serviceUser.logoutUser();
      //  WHEN: El usuario Ana2002 quiere consultar su lista de lugares.
      //  THEN: El sistema lanza una excepción ServerNotOperativeException().
      await expectAsync(servicePlace.getPlaces()).toBeRejectedWith(new ServerNotOperativeException());
      await serviceUser.loginUser("test@test.com","test123");
      servicePlace.deletePlace(lugar1.idPlace);
      servicePlace.deletePlace(lugar2.idPlace);
  });
});
