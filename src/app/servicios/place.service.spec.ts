import { TestBed } from '@angular/core/testing';

import { PlaceService } from './place.service';
import { InvalidCoordenatesException } from '../excepciones/invalid-coordenates-exception';
import { Place } from '../modelos/place';


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
});