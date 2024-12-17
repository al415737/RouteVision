
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
    
      it('HU10E01. Consulta de vehículos dados de alta (Escenario Válido)', async () => {
      
        //Given: El usuario Ana con la sesión iniciada y la listaVehículos = [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
        await servicioUser.loginUser("test@test.com", "test123"); 
        await service.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
        
        //When: El usuario pide mostrar sus vehículos.
        const vehiculos = await service.consultarVehiculo(); 
        
        //Then: El sistema devuelve la lista de listaVehículos =  [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}]
        expect(vehiculos.length).toBe(1);

        vehiculos.forEach((vehiculo: any) => {
            expect(vehiculo).toBeInstanceOf(Vehiculo);
        });

        service.eliminarVehiculo("1234 BBB");
    
      });

      it('HU10E04. El usuario accede con una dirección de correo electrónico en la que no tiene datos guardados (Escenario Inválido)', async () => {
          //Given:  El usuario Ana ha accedido con la dirección de correo: test1@test.com donde no tiene datos guardados. ListaVehículos = {}
            await servicioUser.loginUser("test1@test.com", "test123");

          //When: Ana consulta los vehículos.
            const vehiculos = await service.consultarVehiculo();

          //Then: El sistema no muestra ningún dato.
          expect(vehiculos.length).toBe(0);
      }); 
  });
});
