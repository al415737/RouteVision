
import { TestBed } from '@angular/core/testing';
import { VehiculoService } from './vehiculo.service';
import { Vehiculo } from '../modelos/vehiculo';
import { NullLicenseException } from '../excepciones/null-license-exception';

describe('VehiculoService', () => {
  let service: VehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiculoService);
  });

  it('HU9E01. Vehículo registrado en el sistema (Escenario Válido)', () => {
    /*
      GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002 = [ ].
      WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km].
      THEN: El sistema registra el vehículo en la parte de la base de datos dirigida a Ana2002 →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}].
    */ 
    expect(service.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", "8,1L/100km")).toBeInstanceOf(Vehiculo);
    service.eliminarVehiculo("1234 BBB");
  });


  it('HU9E05. Registro de vehículo sin matricula (Escenario Inválido)', () => {
    /*
      Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}].
      When: El usuario intenta dar de alta un vehículo → [Matrícula=” ”, Marca=”Seat”, Modelo=”Ibiza”, Año Fabricación=”2003”, Consumo=4,3L/100 km].
      Then: El sistema no registra el vehículo y lanza una excepción NullLicenseException() →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}].
    */
    expect(service.crearVehiculo("", "Seat", "Ibiza", "2003", "4,3L/100km")).toThrow(NullLicenseException);
  }); 

});
