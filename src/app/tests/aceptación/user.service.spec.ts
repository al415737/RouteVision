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
import { CocheGasolina } from '../../modelos/vehiculos/cocheGasolina';
import { NoElementsException } from '../../excepciones/no-Elements-exception';

describe('UserService', () => {
  let service: UserService;
  let vehicleService: VehiculoService;
  let placeService: PlaceService;

  beforeEach(() => {
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
  
  /*
  it('HU1E01. User registration in the system (Valid Scenario)', async () => {
    // GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
    // WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
    // THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}]. 
    const result = await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(result).toBeInstanceOf(User);
    service.deleteUser("manu033@gmail.com");
  });

  it('HU1E05. User registration with email already registered in the system with another account (Invalid Scenario)', async () => {
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}].
    await service.createUser("Manuel", "García", "manu034@gmail.com", "Manu-34", "Manu-34");
    // WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, User=”JorgeGarcía”, Email=”manu33@gmail.com”, Contraseña=”JorgeGarcía-02”].
    // THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    
    await expectAsync(
      service.createUser("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02")
    ).toBeRejectedWith(new MailExistingException());
    service.deleteUser("manu034@gmail.com");
  });
  
  it('HU2E01. Login with correct data (Valid Escenary)', async () => {
    //  GIVEN: El usuario Test está registrado y la base de datos está disponible.  Usuario Test: [nombre: Test, User=”test23”, email: “test@test.com”,  contraseña: “test123”].
    //  WHEN: El usuario Pepito quiere iniciar sesión con sus datos.  user: “pepito23”, contraseña:  “Pepito123?_ “.
    //  THEN: El sistema carga los datos de Pepito. ListaVehículos=[{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}] y listaLugaresInterés=[{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar = “000”}].
   
    await service.loginUser("test@test.com", "test123");
    await vehicleService.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasolina 95 E5");
    const lugar = await placeService.createPlaceC([39.98, -0.049]);
    await service.logoutUser();

    const resultLogin = await service.loginUser("test@test.com", "test123");

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
    
    vehicleService.eliminarVehiculo("1234 BBB");
    await placeService.deletePlace(lugar.idPlace);
    await service.logoutUser();
  });
  

  it('HU2E02. Login with incorrect data (Invalid Scenario)', async () => {
    // GIVEN: El usuario Pepito está registrado y la base de datos está disponible. [nombre: “Pepito”, User=”pepito23”, email: “pepito@gmail.com”,  contraseña: “Pepito123?_”]
    // WHEN: El usuario Pepito introduce como contraseña: “pepito123_”
    // THEN: El sistema no inicia la sesión de Pepito porque la contraseña introducida no coincide con la que se encuentra en la base de datos para ese usuario. Lanza la excepción WrongPasswordException().
    
    await expectAsync(
      service.loginUser("test@test.com", "pepito123_")
    ).toBeRejectedWith(new WrongPasswordException());
    service.logoutUser();
  });

  it('HU3-E01. Cierre de sesión de una cuenta de un usuario registrado (Escenario Válido): ', async () => {
    await service.loginUser("test@test.com", "test123");
    await service.logoutUser();

    const currentUser = getAuth().currentUser;

    // Verifico que el usuario actual es null después del logout
    expect(currentUser).toBeNull();
  });

  it('HU3-E02. Cierre de sesión de una cuenta de un usuario registrado con la sesión desactivada (Escenario Inválido): ', async () => {
    try {
      await service.logoutUser();
    } catch (error) {
      expect(error).toBeInstanceOf(UserNotFoundException);
    }
  });
 
  it('HU4-E01. Eliminar una cuenta de un usuario registrado (Escenario Válido)', async () => {
    //Given: Lista actual de usuarios = {Pepa, Pepito, Alba, Dani}.
    await service.createUser("Pepito", "Ramirez", "pepitoramirez@gmail.com", "pepito", "pepito123");
    await service.createUser("Alba", "Consuelos", "albaconsuelos@gmail.com", "alba", "alba123");
    await service.createUser("Dani", "Torres", "danitorres@gmail.com", "dani", "dani123");
    await service.createUser("Pepa", "Gimena", "pepagimena@gmail.com", "pepa", "pepa123");

    //When: El usuario Pepa quiere eliminar su cuenta del sistema.
    await service.deleteUser('pepagimena@gmail.com');

    //Then: Lista actual de usuarios {Pepito, Alba, Dani}
    const usuariosEnSistema = await service.consultarUsuarios();

    const userPepa = usuariosEnSistema.find(usuario => usuario.getEmail() === 'pepagimena@gmail.com');
    expect(userPepa).toBeUndefined();

    await service.deleteUser('pepitoramirez@gmail.com');
    await service.deleteUser('albaconsuelos@gmail.com');
    await service.deleteUser('danitorres@gmail.com');
});
*/

  it('HU4-E02. Eliminar una cuenta de un usuario no registrado (Escenario Inválido)', async () => {
      //Given: Lista actual de usuarios = {Pepito, Alba, Dani}.
      await service.createUser("Pepito", "Ramirez", "pepitoramirez@gmail.com", "pepito", "pepito123");
      await service.createUser("Alba", "Consuelos", "albaconsuelos@gmail.com", "alba", "alba123");
      await service.createUser("Dani", "Torres", "danitorres@gmail.com", "dani", "dani123");
      await service.logoutUser();

      try {
          //When: El usuario Random quiere cerrar sesión y eliminar su cuenta del sistema.
          await service.deleteUser("pepagimena@gmail.com");
      } catch(error){
           //Then: El sistema lanza una excepción UserNotFoundException().
           expect(error).toBeInstanceOf(UserNotFoundException);
      } finally {
           await service.deleteUser("pepitoramirez@gmail.com");
           await service.deleteUser("albaconsuelos@gmail.com");
           await service.deleteUser("danitorres@gmail.com");
      }
  });
  
  /*
  it('HU20-E01. Usuario marca como favorito su coche (Escenario Válido)', async() => {
    //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“ppt-24”] tiene iniciada su cuenta y la base de datos está disponible. Lista de vehículos: [ {“8291 DTS” , 2002, “Seat”, “León”, 5.1L/100km, 'Precio Gasolina 98 E5'}, {"1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A'} ]. 
    await service.loginUser("test@test.com", "test123");
    const vehiculo = await vehicleService.crearVehiculo("8291 DTS", "Seat", "León", "2002", 5.1, "Precio Gasolina 95 E5");

    //When: El usuario quiere marcar como favorito su vehículo → [ Matrícula: “8291 DTS” , AñoFabricación: 2002, Marca: “Seat”, Modelo: “León”, Consumo: 5.1L/100km ].
    await vehicleService.marcarFavorito(vehiculo);
    
    //Then: El sistema marca como favorito al vehículo, es decir, este vehículo se añade a una lista de listaVehículosFavoritos → [ Matrícula: “8291 DTS” , AñoFabricación: 2002, Marca: “Seat”, Modelo: “León”, Consumo: 5.1L/100km ]. 
    const vehiculos = await vehicleService.consultarVehiculo();

    expect(vehiculos[0].matricula).toBe("8291 DTS");
    expect(vehiculos[0].favorito).toBe(true);

    vehicleService.eliminarVehiculo("8291 DTS");
  
  });
  
  it('HU20-E03. Intento de marcar como favorito pero no tiene elementos registrados (Escenario Inválido)', async() => {
    //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“ppt-24”] ha iniciado sesión, la base de datos está disponible, pero no tiene ningún elemento registrado. Lista de vehículos = [ ].
    await service.loginUser("test@test.com", "test123");
    const vehiculo = new CocheGasolina("8291 DTS", "Seat", "León", "2002", 5.1, "Precio Gasolina 95 E5");

    try {
      //When: El usuario quiere marcar como favorito a su vehículo.
      await vehicleService.marcarFavorito(vehiculo);
    } catch(error){
      //Then: El sistema no puede marcar como favorito nada y lanza la excepción NoElementsException().
      expect(error).toBeInstanceOf(NoElementsException);
    }
  });
  */

});


