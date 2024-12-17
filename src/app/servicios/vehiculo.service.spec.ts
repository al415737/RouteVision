
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
import { User } from '../modelos/user';
import { UserService } from './user.service';
import { USER_REPOSITORY_TOKEN } from '../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../repositorios/firebase/user-firebase.service';
import { InvalidEmailException } from '../excepciones/invalid-email-exception';

describe('VehiculoService', () => {
  let service: VehiculoService;
  let servicioUser: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),     
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        VehiculoService,
        { provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService },  
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService }, 
      ]
    });
    service = TestBed.inject(VehiculoService);
    servicioUser = TestBed.inject(UserService);
  });



  fdescribe('VehiculoService', () => {
    it('HU9E01. Vehículo registrado en el sistema (Escenario Válido)', async () => {
        //GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002 = [ ].
        servicioUser.loginUser("test@test.com", "test123");

        //WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1].
        const resul = await service.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);

        //THEN: El sistema registra el vehículo en la parte de la base de datos dirigida a Ana2002 →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].      
        expect(resul).toBeInstanceOf(Vehiculo);
        service.eliminarVehiculo("1234 BBB"); 
    });
  
    it('HU9E05. Registro de vehículo sin matricula (Escenario Inválido)', async () => {
      try {
        //Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
        servicioUser.loginUser("test@tets.com", "test123");
        const resul = await service.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1); 

        try {
          //When: El usuario intenta dar de alta un vehículo → [Matrícula=” ”, Marca=”Seat”, Modelo=”Ibiza”, Año Fabricación=”2003”, Consumo=4.3].
          await service.crearVehiculo("", "Seat", "Ibiza", "2003", 4.3);
        } catch(error){
            //Then: El sistema no registra el vehículo y lanza una excepción NullLicenseException() →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
            expect(error).toBeInstanceOf(NullLicenseException);
        }
      } finally {
          await service.eliminarVehiculo("1234 BBB");
      }
    });
  });
});
