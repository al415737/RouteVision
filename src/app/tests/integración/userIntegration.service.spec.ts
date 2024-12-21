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
    const mockUser: User = new User("Manuel", "García", "manu033@gmail.com", "Manu-33");
    spyOn(userRepo, 'createUser').and.resolveTo(mockUser);

    /* GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
       WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
       THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}]. 
    */
    const result = await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(userRepo.createUser).toHaveBeenCalledWith("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(result).toEqual(mockUser);
  });

  it('HU1E05. User registration with email already registered in the system with another account (Invalid Scenario)', async () => {
    const mockUser: User = new User("Manuel", "García", "manu034@gmail.com", "Manu-34");
    spyOn(userRepo, 'createUser').and.resolveTo(mockUser);
    
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}].
     /* WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, User=”JorgeGarcía”, Email=”manu33@gmail.com”, Contraseña=”JorgeGarcía-02”].
       THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    */
    try {
      service.createUser("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02");
      expect(userRepo.createUser).toHaveBeenCalledWith("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02");
    } catch (error) {
      expect(error).toBeInstanceOf(MailExistingException);
    }
  });
});
