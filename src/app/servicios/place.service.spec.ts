import { TestBed } from '@angular/core/testing';

import { PlaceService } from './place.service';
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { Place } from '../modelos/place';
import { InvalidPlaceException } from '../excepciones/invalid-place-exception';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';


describe('PlaceService', () => {
  let service: PlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceService);
  });

  it('HU5E01. Registrar nuevo lugar de interés (Caso Válido):', () => {
    /* GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
       WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 39.98, Longitud: -0.049]
       THEN: El sistema registra el lugar de interés de Ana2002. → placeListAna2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049]}, idLugar = “000”}.
    */
    expect(service.createPlaceC("001", [39.98, -0.049])).toBeInstanceOf(Place);
    service.deletePlace("001");
  });

  it('HU5E02. Registro de un lugar de interés incorrecto (Caso Inválido):', () => {
    /*  GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002 = [ ].
        WHEN: Intenta dar de alta un lugar de interés → Coordenadas = [Latitud: 899,98, Longitud:].
        THEN: El sistema no registra el lugar de interés y lanza la excepción InvalidCoordinatesException().
    */ 
    expect(service.createPlaceC("001", [39.98, -8888])).toThrow(InvalidCoordenatesException);
  });


  it('HU6E01. Registro de lugar de interés con un topónimo correcto (Escenario Válido):', () => {
    /*  GIVEN: La API está disponible y el usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] tiene en su base de datos la lista → listaLugaresInteres-Ana2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049],  idLugar = “000”}.
        WHEN: Intenta dar de alta un lugar de interés → Topónimo = “Bilbao”.
        THEN: El sistema registra el lugar de interés de Ana2002 →  lugaresInteres-Ana2002= [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049],  idLugar = “000”}}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528],  idLugar = “001”}}.
    */ 
    expect(service.createPlaceT("002", "Bilbao")).toBeInstanceOf(Place);
    service.deletePlace("002");
  });

  it('HU6E03. Registro de lugar de interés con un topónimo incorrecto (Escenario Inválido):', () => {
    /*  GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] quiere dar de alta un nuevo lugar de interés. La API está disponible → lugaresInteres-Ana2002= [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049],  idLugar = “000”}}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528],  idLugar = “001”}.
        When: Intenta dar de alta un lugar de interés → Topónimo = “Cassjdlftellfisonon”.
        THEN: El sistema no registra el lugar de interés y se genera la excepción InvalidPlaceException().
    */ 
    expect(service.createPlaceT(" ", "Cassjdlftellfisonon")).toThrow(InvalidPlaceException);
  });

  it('HU7E01. Consulta de lista de lugares dados de alta (Escenario válido):', () => {
    /*  GIVEN: La API está disponible y el usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con  listaLugaresInteres-Ana2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”}].*/
        service.createPlaceC("000", [39.98,-0.049]);
        service.createPlaceT("001", "Bilbao");

    /*  WHEN: El usuario Ana2002 quiere consultar su lista de lugares.
        THEN: El sistema le muestra la lista de lugares = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”}].
    */
        expect(service.getPlaces("Ana2002")).toBeInstanceOf(Array);
        service.deletePlace("000");
        service.deletePlace("001");
  });

  it('HU7E02. Consulta de lista de lugares dados de alta sin conexión a la BBDD (Escenario inválido):', () => {
    /*  GIVEN:  La API está disponible y el usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaLugaresInteres-Ana2002 = [{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar=”000”}, {NombreCiudad = “Bilbao”, Coordenadas = [Latitud: 43.26271, Longitud: -2.92528], idLugar=”001”}].*/
        service.createPlaceC("000", [39.98,-0.049]);
        service.createPlaceT("001", "Bilbao");

    /*  WHEN: El usuario Ana2002 quiere consultar su lista de lugares.
        THEN: El sistema lanza una excepción ServerNotOperativeException().*/
        expect(service.getPlaces("Ana2002")).toThrow(ServerNotOperativeException);
        service.deletePlace("000");
        service.deletePlace("001");
  });
});