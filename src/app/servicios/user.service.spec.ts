import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { User } from '../modelos/user';
import { MailExistingException } from '../excepciones/mail-existing-exception';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../repositorios/firebase/user-firebase.service';
import { firebaseConfig } from '../app.config';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)), 
        provideFirestore(() => getFirestore()),  
      ],
      providers: [
        UserService,
        { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService },
      ]
    }).compileComponents();

    service = TestBed.inject(UserService);
  });
  

  it('HU1E01. User registration in the system (Valid Scenario)', async () => {
    /* GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
       WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
       THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}]. 
    */
    const result = await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(result).toBeInstanceOf(Promise<User>);
  });

  it('HU1E05. User registration with email already registered in the system with another account (Invalid Scenario)', async () => {
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}].
    await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    /* WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, User=”JorgeGarcía”, Email=”manu33@gmail.com”, Contraseña=”JorgeGarcía-02”].
       THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    */
    await expectAsync(() => {
      service.createUser("Jorge", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    }).toBeRejectedWith(new MailExistingException());
    service.deleteUser("manu033@gmail.com");
  });
});
