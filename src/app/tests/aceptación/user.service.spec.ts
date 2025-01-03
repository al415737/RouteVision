import { TestBed } from '@angular/core/testing';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { USER_REPOSITORY_TOKEN} from '../../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { firebaseConfig } from '../../app.config';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { PlaceService } from '../../servicios/place.service';
import { WrongPasswordException } from '../../excepciones/wrong-password-exception';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { Place } from '../../modelos/place';
import { PLACE_REPOSITORY_TOKEN } from '../../repositorios/interfaces/place-repository';
import { PlaceFirebaseService } from '../../repositorios/firebase/place-firebase.service';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { provideHttpClient } from '@angular/common/http';
import { UserNotFoundException } from '../../excepciones/user-not-found-exception';
import { PrefereneInvalidException } from '../../excepciones/preference-invalid-exception';

describe('UserService', () => {
  let service: UserService;
  let vehicleService: VehiculoService;
  let placeService: PlaceService;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(), // Configuración moderna para HttpClient
        provideFirebaseApp(() => initializeApp(firebaseConfig)), 
        provideFirestore(() => getFirestore()), 
        provideAuth(() => getAuth()),
        UserService,
        VehiculoService,
        PlaceService,
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService },
        { provide: PLACE_REPOSITORY_TOKEN, useClass: PlaceFirebaseService },
        { provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService },
        
      ]
    }).compileComponents();

    service = TestBed.inject(UserService);
    vehicleService = TestBed.inject(VehiculoService);
    placeService = TestBed.inject(PlaceService);
  });
  
  
  it('HU1E01. Registro de usuario en el sistema (Escenario Válido):', async () => {
    // GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
    
    // WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
    const result = await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    
    // THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”, preferencia1=’ ’, preferencia2=’ ‘}].
    expect(result).toBeInstanceOf(User);
    await service.loginUser("manu033@gmail.com", "Manu-33");
    await service.deleteUser("manu033@gmail.com");
  });

  it('HU1E05. Registro de usuario con email ya registrado en el sistema con otra cuenta (Escenario inválido):', async () => {
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, Email=”manu34@gmail.com”, User=”Manu34”, Contraseña=”Manu-34”, preferencia1=’ ’, preferencia2=’ ‘}].
    await service.createUser("Manuel", "García", "manu034@gmail.com", "Manu-34", "Manu-34");
    await service.logoutUser();
    // WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, Email=”manu34@gmail.com”,  User=”JorgeGarcía”, Contraseña=”JorgeGarcía-02”].
    // THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    
    await expectAsync(service.createUser("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02")
    ).toBeRejectedWith(new MailExistingException());
    await service.loginUser("manu034@gmail.com", "Manu-34")
    await service.deleteUser("manu034@gmail.com");
  });
  
  it('HU2E01. Inicio de sesión con datos correctos (Escenario Válido):', async () => {
    //  GIVEN: El usuario UserTest está registrado y la base de datos está disponible. Datos de UserTest:
    // ListaVehículos=[{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1, Combustible = "Gasolina"}]
    // y listaLugaresInterés=[{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar = “000”}].
    await service.loginUser("test@test.com", "test123");
    await vehicleService.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina");
    const lugar = await placeService.createPlaceC([39.98, -0.049]);
    await service.logoutUser();

    //  WHEN: El usuario UserTest quiere iniciar sesión con sus datos: [email: “usertest@test.com”, contraseña:  “test123 “].
    const resultLogin = await service.loginUser("test@test.com", "test123");
    //  THEN: El sistema carga los datos de UserTest.
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
    
    await service.loginUser("test@test.com", "test123");
    await vehicleService.eliminarVehiculo("1234 BBB");
    await placeService.deletePlace(lugar.idPlace);
    await service.logoutUser();
  });
  

  it('HU2E02. Inicio de sesión con información incorrecta (Escenario Inválido):', async () => {
    // GIVEN: El usuario UserTest está registrado y la base de datos está disponible.

    // WHEN: El usuario UserTest intenta iniciar sesion con la siguiente información: [email: “usertest@test.com”, contraseña: “test1234“].
    // THEN: El sistema no inicia la sesión de UserTest porque la contraseña no es correcta y lanza la excepción WrongPasswordException().
    await expectAsync(
      service.loginUser("test@test.com", "pepito123_")
    ).toBeRejectedWith(new WrongPasswordException());
  });

  it('HU3-E01. Cierre de sesión de una cuenta de un usuario registrado (Escenario Válido): ', async () => {
    // GIVEN: Lista actual de usuarios conectados. ListaUsuariosConectados = {UserTest}.
    await service.loginUser("test@test.com", "test123");

    // WHEN: El usuario UserTest pide que su sesión se cierre.
    await service.logoutUser();

    // THEN: Lista actual de usuarios conectados ListaUsuariosConectados = {}.
    const currentUser = getAuth().currentUser;
    // Verifico que el usuario actual es null después del logout
    expect(currentUser).toBeNull();
  });

  it('HU3-E02. Cierre de sesión de una cuenta de un usuario registrado con la sesión desactivada (Escenario Inválido): ', async () => {
    // GIVEN: Lista actual de usuarios conectados. ListaUsuariosConectados = {}.
    
    // WHEN: El usuario UserTest pide que su sesión se cierre.
    // THEN: El sistema lanza una excepción UserNotFoundException().
    try {
      await service.logoutUser();
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundException);
    }
  });
 
  it('HU4-E01. Eliminar una cuenta de un usuario registrado (Escenario Válido)', async () => {
    //GIVEN: Lista actual de usuarios = {Pepa, Pepito}.
    await service.createUser("Pepito", "Ramirez", "pepitoramirez@gmail.com", "pepito", "pepito123");
    await service.logoutUser();
    await service.createUser("Pepa", "Gimena", "pepagimena@gmail.com", "pepa", "pepa123");

    //WHEN: El usuario Pepa quiere eliminar su cuenta del sistema.
    await service.deleteUser('pepagimena@gmail.com');


    //Then: Lista actual de usuarios {Pepito}
    const usuariosEnSistema = await service.consultarUsuarios();

    const userPepa = usuariosEnSistema.find(usuario => usuario.getEmail() === 'pepagimena@gmail.com');
    expect(userPepa).toBeUndefined();

    await service.loginUser("pepitoramirez@gmail.com", "pepito123");
    await service.deleteUser('pepitoramirez@gmail.com');
  });

  it('HU4-E02. Eliminar una cuenta de un usuario no registrado (Escenario Inválido)', async () => {
    //Given: Lista actual de usuarios = {Pepito, Alba}.
    await service.createUser("Pepito", "Ramirez", "pepitoramirez@gmail.com", "pepito", "pepito123");
    await service.logoutUser();
    await service.createUser("Alba", "Consuelos", "albaconsuelos@gmail.com", "alba", "alba123");
    await service.logoutUser();

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        //When: El usuario Random quiere cerrar sesión y eliminar su cuenta del sistema.
        await service.logoutUser();
    } catch(error){
          //Then: El sistema lanza una excepción UserNotFoundException().
          expect(error).toBeInstanceOf(UserNotFoundException);
    } finally {
          await service.loginUser("pepitoramirez@gmail.com", "pepito123");
          await service.deleteUser("pepitoramirez@gmail.com");
          await service.loginUser("albaconsuelos@gmail.com", "alba123");
          await service.deleteUser("albaconsuelos@gmail.com");
    }
  });

  it('HU21-E01. Configuración de un vehículo/método de transporte predeterminado (Escenario Válido): ', async () => {
    await service.loginUser('usertest@test.com', 'test123');
    await service.editUser(1, 'foot-walking');

    const user: User | null  = await service.getUsuario();
    let preference: string = '';
    if (user != null) 
      preference = user.getPref1();

    expect(preference).toEqual('foot-walking');
    await service.editUser(1, '');
    await service.logoutUser();
  });

  it('HU21-E03. Configuración de un vehículo/metodo de transporte predeterminado con un vehículo inexistente (Escenario Inválido): ', async () => {
    await service.loginUser('usertest@test.com', 'test123');
    
    try {
      await service.editUser(1, 'foooot');
    } catch (error) {
      expect(error).toBeInstanceOf(PrefereneInvalidException);    //CAMBIAR NOMBRE PORFA, PARECE QUE PONGA prefeIRENE
    }

    await service.logoutUser();
  });

  it('HU22-E01. Establecimiento de la ruta más rápida por defecto (Escenario Válido): ', async () => {
    await service.loginUser('usertest@test.com', 'test123');
    await service.editUser(2, 'fastest');
    
    const user: User | null  = await service.getUsuario();
    let preference: string = '';
    if (user != null) 
      preference = user.getPref2();

    expect(preference).toEqual('fastest');
    await service.editUser(2, '');
    await service.logoutUser();
  });

  it('HU22-E0X. Establecimiento de la ruta que no existe por defecto (Escenario Inválido): ', async () => {
    await service.loginUser('usertest@test.com', 'test123');
    
    try {
      await service.editUser(2, 'mierdatest');
    } catch (error) {
      expect(error).toBeInstanceOf(PrefereneInvalidException);
    }

    await service.logoutUser();
  });
});


