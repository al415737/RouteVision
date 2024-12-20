import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../modelos/user';
import { MailExistingException } from '../excepciones/mail-existing-exception';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../repositorios/firebase/user-firebase.service';
import { firebaseConfig } from '../app.config';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { VehiculoService } from './vehiculo.service';
import { PlaceService } from './place.service';
import { WrongPasswordException } from '../excepciones/wrong-password-exception';
import { Vehiculo } from '../modelos/vehiculo';
import { Place } from '../modelos/place';

describe('UserService', () => {
  let service: UserService;
  let vehicleService: VehiculoService;
  let placeService: PlaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)), 
        provideFirestore(() => getFirestore()), 
        provideAuth(() => getAuth()),
        UserService,
        VehiculoService,
        PlaceService,
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService },
      ]
    }).compileComponents();

    service = TestBed.inject(UserService);
    vehicleService = TestBed.inject(VehiculoService);
    placeService = TestBed.inject(PlaceService);
  });
  

  it('HU1E01. User registration in the system (Valid Scenario)', async () => {
    /* GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
       WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
       THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}]. 
    */
    const result = await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(result).toBeInstanceOf(User);
    service.deleteUser("manu033@gmail.com");
  });

  it('HU1E05. User registration with email already registered in the system with another account (Invalid Scenario)', async () => {
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}].
    await service.createUser("Manuel", "García", "manu034@gmail.com", "Manu-34", "Manu-34");
    /* WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, User=”JorgeGarcía”, Email=”manu33@gmail.com”, Contraseña=”JorgeGarcía-02”].
       THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    */
    await expectAsync(
      service.createUser("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02")
    ).toBeRejectedWith(new MailExistingException());
    service.deleteUser("manu034@gmail.com");
  });

  it('HU2E01. Login with correct data (Valid Escenary)', async () => {
    // GIVEN: El usuario Pepito está registrado y la base de datos está disponible.  Usuario Pepito: [nombre: “Pepito”, User=”pepito23”, email: “pepito@gmail.com”,  contraseña: “Pepito123?_”].
    await service.createUser("Pepito", "Gonzalez", "pepito@gmail.com", "pepito23", "Pepito123?_");
    vehicleService.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", "8,1L/100 km");
    placeService.createPlaceC("000", [39.98, -0.049]);
    service.logoutUser();
    
    /* WHEN: El usuario Pepito quiere iniciar sesión con sus datos.  user: “pepito23”, contraseña:  “Pepito123?_ “.
       THEN: El sistema carga los datos de Pepito. ListaVehículos=[{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}] y listaLugaresInterés=[{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar = “000”}].*/
   
    const resultLogin = await service.loginUser("pepito@gmail.com", "Pepito123?_");

    // Verifico que el resultado es una lista
    expect(resultLogin).toBeInstanceOf(Array);

    // Verifico que el primer elemento de la lista es una lista
    expect(resultLogin[0]).toBeInstanceOf(Array);

    // Verifico que el primer elemento sea una lista de vehículos
    resultLogin[0].forEach((vehiculo: any) => {
      expect(vehiculo).toBeInstanceOf(Vehiculo);
    });
    
    // Verifico que el segundo elemento de la lista es una lista
    expect(resultLogin[1]).toBeInstanceOf(Array);

    // Verifico que el segundo elemento sea una lista de lugares
    resultLogin[1].forEach((lugar: any) => {
      expect(lugar).toBeInstanceOf(Place);
    });
    
    service.deleteUser("pepito@gmail.com");
    vehicleService.eliminarVehiculo("1234 BBB");
    placeService.deletePlace("000");
  });

  it('HU2E02. Login with incorrect data (Invalid Scenario)', async () => {
    // GIVEN: El usuario Pepito está registrado y la base de datos está disponible. [nombre: “Pepito”, User=”pepito23”, email: “pepito@gmail.com”,  contraseña: “Pepito123?_”]
    await service.createUser("Pepito", "Gonzalez", "pepito3@gmail.com", "pepito23", "Alex123_");
    service.logoutUser();
    /* WHEN: El usuario Pepito introduce como contraseña: “pepito123_”
       THEN: El sistema no inicia la sesión de Pepito porque la contraseña introducida no coincide con la que se encuentra en la base de datos para ese usuario. Lanza la excepción WrongPasswordException().
    */
    await expectAsync( 
      service.loginUser("pepito3@gmail.com", "pepito123_")
      ).toBeRejectedWith(new WrongPasswordException());
    service.deleteUser("pepito3@gmail.com");
  });
});
