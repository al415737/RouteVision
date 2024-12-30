import { TestBed } from '@angular/core/testing';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../../repositorios/interfaces/user-repository';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from '../../app.config';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { Place } from '../../modelos/place';
import { WrongPasswordException } from '../../excepciones/wrong-password-exception';
import { UserNotFoundException } from '../../excepciones/user-not-found-exception';
import { CocheGasolina } from '../../modelos/vehiculos/cocheGasolina';

describe('UserIntegrationService', () => {
  let service: UserService;
  let userRepo: UserRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        UserService,
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService},
      ]
    }).compileComponents();

    service = TestBed.inject(UserService);
    userRepo = TestBed.inject(USER_REPOSITORY_TOKEN);
  });
  
  
  it('HU1E01. User registration in the system (Valid Scenario)', async () => {
    const mockUser: User = new User("Manuel", "García", "manu033@gmail.com", "Manu-33",'','');
    spyOn(userRepo, 'createUser').and.resolveTo(mockUser);

    // GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
    // WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
    // THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}]. 
    
    const result = await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(userRepo.createUser).toHaveBeenCalledWith("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33",'','');
    expect(result).toEqual(mockUser);
  });

  
  it('HU1E05. User registration with email already registered in the system with another account (Invalid Scenario)', async () => {
    const mockUser: User = new User("Manuel", "García", "manu034@gmail.com", "Manu-34",'','');
    spyOn(userRepo, 'createUser').and.resolveTo(mockUser);
    
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}].
    // WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, User=”JorgeGarcía”, Email=”manu33@gmail.com”, Contraseña=”JorgeGarcía-02”].
    //   THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    
    try {
      service.createUser("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02");
      expect(userRepo.createUser).toHaveBeenCalledWith("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02",'','');
    } catch (error) {
      expect(error).toBeInstanceOf(MailExistingException);
    }
  });
  

  it('HU2E01. Login with correct data (Valid Escenary)', async () => {
    // GIVEN: El usuario Pepito está registrado y la base de datos está disponible.  Usuario Pepito: [nombre: “Pepito”, User=”pepito23”, email: “pepito@gmail.com”,  contraseña: “Pepito123?_”].
    // WHEN: El usuario Pepito quiere iniciar sesión con sus datos.  user: “pepito23”, contraseña:  “Pepito123?_ “.
    //  THEN: El sistema carga los datos de Pepito. ListaVehículos=[{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}] y listaLugaresInterés=[{NombreCiudad = “Castelló de la Plana”, Coordenadas = [Latitud: 39.98, Longitud: -0.049], idLugar = “000”}].
    
    const result: [Vehiculo[], Place[]] = [[new CocheGasolina("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasolina 95 E5")], [new Place("001", "Castellón de la Plana", [39.98, -0.049], true)]];
    spyOn(userRepo, 'loginUser').and.resolveTo(result);

    const resultService = await service.loginUser("test@test.com", "test123");
    expect(userRepo.loginUser).toHaveBeenCalledWith("test@test.com", "test123");
    expect(resultService).toEqual(result);
  });
  

  it('HU2E02. Login with incorrect data (Invalid Scenario)', async () => {
    // GIVEN: El usuario Pepito está registrado y la base de datos está disponible. [nombre: “Pepito”, User=”pepito23”, email: “pepito@gmail.com”,  contraseña: “Pepito123?_”]
    // WHEN: El usuario Pepito introduce como contraseña: “pepito123_”
    // THEN: El sistema no inicia la sesión de Pepito porque la contraseña introducida no coincide con la que se encuentra en la base de datos para ese usuario. Lanza la excepción WrongPasswordException().
    
    const result: [Vehiculo[], Place[]] = [[new CocheGasolina("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasolina 95 E5")], [new Place("001", "Castellón de la Plana", [39.98, -0.049], true)]];
    spyOn(userRepo, 'loginUser').and.resolveTo(result);

    try {
      const resultService = await service.loginUser("test@test.com", "pepito123_");
      expect(userRepo.loginUser).toHaveBeenCalledWith("test@test.com", "pepito123_");
      expect(resultService).toEqual(result);
    } catch (error) {
      throw new WrongPasswordException();
    }
  });
  
  //HISTORIA 3
  it('PRUEBA INTEGRACIÓN --> HU3-E01. Cierre de sesión de una cuenta de un usuario registrado (Escenario Válido): ', async () => {
    spyOn(userRepo, 'logoutUser').and.resolveTo();

    await service.loginUser("test@test.com", "test123");
    const result = await service.logoutUser();
    expect(userRepo.logoutUser).toHaveBeenCalledWith();
    expect(result).toBeUndefined();
  });

  it('PRUEBA INTEGRACIÓN --> HU3-E02. Cierre de sesión de una cuenta de un usuario registrado con la sesión desactivada (Escenario Inválido): ', async () => {
    spyOn(userRepo, 'logoutUser').and.resolveTo();

    try {
      await service.logoutUser();
    } catch (error) {
     expect(error).toBeInstanceOf(UserNotFoundException);
    }
  });

  it('HU4-E01. Eliminar una cuenta de un usuario registrado (Escenario Válido)', async () => {
    //Given: Lista actual de usuarios = {Pepa, Pepito, Alba, Dani}.
    const mockData: User[] = [
                new User("Pepito", "Ramirez", "pepitoramirez@gmail.com", "pepito",'',''),
                new User("Alba", "Consuelos", "albaconsuelos@gmail.com", "alba",'',''),
                new User("Dani", "Torres", "danitorres@gmail.com", "dani",'',''),
    ];

    spyOn(userRepo, 'deleteUser').and.resolveTo();
    spyOn(userRepo, 'consultarUsuarios').and.resolveTo(mockData);

    //When: El usuario Pepa quiere eliminar su cuenta del sistema.
    await service.deleteUser('pepagimena@gmail.com');

    //Then: Lista actual de usuarios {Pepito, Alba, Dani}
    const usuarios = await service.consultarUsuarios();
    expect(usuarios).toEqual(mockData);
  
  });

  
  it('HU4-E02. Eliminar una cuenta de un usuario no registrado (Escenario Inválido)', async () => {
      //Given: Lista actual de usuarios = {Pepito, Alba, Dani}.
      const mockData: User[] = [
                new User("Pepito", "Ramirez", "pepitoramirez@gmail.com", "pepito",'',''),
                new User("Alba", "Consuelos", "albaconsuelos@gmail.com", "alba",'',''),
                new User("Dani", "Torres", "danitorres@gmail.com", "dani",'',''),
      ];

      spyOn(userRepo, 'deleteUser').and.resolveTo();
      spyOn(userRepo, 'logoutUser').and.resolveTo();

      //When: El usuario Random quiere eliminar su cuenta del sistema.
      await service.deleteUser('pepagimena@gmail.com');

      //Then: El sistema lanza una excepción UserNotFoundException().
      try {
        await service.logoutUser();
      } catch (error) {
        expect(error).toBeInstanceOf(UserNotFoundException);
      }
  });

  it('HU20-E01. Usuario marca como favorito su coche (Escenario Válido)', async() => {
      //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“ppt-24”] tiene iniciada su cuenta y la base de datos está disponible. Lista de vehículos: [ Matrícula: “8291 DTS” , AñoFabricación: 2002, Marca: “Seat”, Modelo: “León”, Consumo: 5.1L/100km ]. 
      //When: El usuario quiere marcar como favorito su vehículo → [ Matrícula: “8291 DTS” , AñoFabricación: 2002, Marca: “Seat”, Modelo: “León”, Consumo: 5.1L/100km ].
      //Then: El sistema marca como favorito al vehículo, es decir, este vehículo se añade a una lista de listaVehículosFavoritos → [ Matrícula: “8291 DTS” , AñoFabricación: 2002, Marca: “Seat”, Modelo: “León”, Consumo: 5.1L/100km ]. 
  });

  it('HU20-E03. Intento de marcar como favorito pero no tiene elementos registrados (Escenario Inválido)', async() => {
      //Given: El usuario [“Pepito2002”, “pepito@gmail.com“,“ppt-24”] ha iniciado sesión, la base de datos está disponible, pero no tiene ningún elemento registrado. Lista de vehículos = [ ].
      //When: El usuario quiere marcar como favorito a su vehículo.
      //Then: El sistema no puede marcar como favorito nada y lanza la excepción NoElementsException().
  });

});
