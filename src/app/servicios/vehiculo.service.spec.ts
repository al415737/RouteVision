
import { TestBed } from '@angular/core/testing';
import { VehiculoService } from './vehiculo.service';
import { Vehiculo } from '../modelos/vehiculo';
import { NullLicenseException } from '../excepciones/null-license-exception';
import { ServerNotOperativeException } from '../excepciones/server-not-operative-exception';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../app.config';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { VEHICULO_REPOSITORY_TOKEN } from '../repositorios/interfaces/vehiculo-repository';
import { VehiculoFirebaseService } from '../repositorios/firebase/vehiculo-firebase.service';

describe('VehiculoService', () => {
  let service: VehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        VehiculoService,
        { provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService },
      ]
    });
    service = TestBed.inject(VehiculoService);
  });


  fdescribe('VehiculoService', () => {
    it('HU9E01. Vehículo registrado en el sistema (Escenario Válido)', async () => {
      /*
        GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002 = [ ].
        WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km].
        THEN: El sistema registra el vehículo en la parte de la base de datos dirigida a Ana2002 →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}].
      */ 

      const resul = await service.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
      expect(resul).toBeInstanceOf(Vehiculo);
      service.eliminarVehiculo("1234 BBB");
    });
  
  
    it('HU9E05. Registro de vehículo sin matricula (Escenario Inválido)', async () => {
      try {
        //Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}].
        const resul = await service.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
        //When: El usuario intenta dar de alta un vehículo → [Matrícula=” ”, Marca=”Seat”, Modelo=”Ibiza”, Año Fabricación=”2003”, Consumo=4,3L/100 km].
        //Then: El sistema no registra el vehículo y lanza una excepción NullLicenseException() →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}].
        
        await expectAsync(
          service.crearVehiculo("", "Seat", "Ibiza", "2003", 4.3)
        ).toBeRejectedWith(new NullLicenseException());

      } finally {
          await service.eliminarVehiculo("1234 BBB");
      }
    }); 

    it('HU10E01. Consulta de vehículos dados de alta (Escenario Válido)', () => {
      /*
        Given: El usuario Ana con la sesión iniciada y la listaVehículos = [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}].
        When: El usuario pide mostrar sus vehículos.
        Then: El sistema devuelve la lista de listaVehículos =  [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}]
      */
      
      service.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
      expect(service.consultarVehiculo("ana03")).toBeInstanceOf(Array); 
      service.eliminarVehiculo("1234 BBB");
    }); 
  
    it('HU10E02. Fallo en la conexión con el servidor (Escenario Inválido)', () => {
      /*
        Given: El usuario Ana con la sesión iniciada y la listaVehículos =  {{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}}.
        When: El usuario pide mostrar sus vehículos.
        Then: El sistema no consigue mostrar los vehículos y lanza la excepción ServerNotOperativeException().
      */
      expect(service.consultarVehiculo("ana03")).toThrow(ServerNotOperativeException);
    }); 
  
  });
});
