import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { User } from '../modelos/user';
import { MailExistingException } from '../excepciones/mail-existing-exception';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('HU1E01. User registration in the system (Valid Escenary)', () => {
    /* GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
       WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
       THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}]. 
    */
    expect(service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33"))
                        .toBeInstanceOf(User);
    service.deleteUser("Manu-33");
  });

  it('HU1E05. User registration with email already registered in the system with another account (Invalid Scenario)', () => {
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}].
    service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    /* WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, User=”JorgeGarcía”, Email=”manu33@gmail.com”, Contraseña=”JorgeGarcía-02”].
       THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    */
    expect(() => {
      service.createUser("Jorge", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
              }).toThrow(MailExistingException);
    service.deleteUser("Manu-33");
  });
});