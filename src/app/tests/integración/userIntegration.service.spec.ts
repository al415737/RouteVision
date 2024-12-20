import { TestBed } from '@angular/core/testing';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../../repositorios/interfaces/user-repository';

describe('UserIntegrationService', () => {
  let service: UserService;
  let userRepo: UserRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: USER_REPOSITORY_TOKEN, useValue: { createUser: () => {}, 
                                                      deleteUser: () => {} } 
        },
      ]
    }).compileComponents();

    service = TestBed.inject(UserService);
    userRepo = TestBed.inject(USER_REPOSITORY_TOKEN);
  });
  

  it('HU1E01. User registration in the system (Valid Scenario)', async () => {
    const mockUser: User = new User("Manuel", "García", "manu033@gmail.com", "Manu-33");
    spyOn(userRepo, 'createUser').and.callFake((nombre, apellidos, email, user, password) => {
        if (nombre && apellidos && email && user && password) 
            return Promise.resolve(mockUser);
        
        return Promise.reject(new Error('Invalid input'));
    });

    spyOn(userRepo, 'deleteUser').and.resolveTo();
    
    /* GIVEN: El usuario Manu-33 no está registrado en el sistema y se tiene conexión con la base de datos → ListaUsuarios = [ ].
       WHEN: Manuel intenta registrarse →[Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”].
       THEN: El sistema registra a Manuel  y se almacena en la base de datos → ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}]. 
    */
    const result = await service.createUser("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(userRepo.createUser).toHaveBeenCalledWith("Manuel", "García", "manu033@gmail.com", "Manu-33", "Manu-33");
    expect(result).toEqual(mockUser);

    service.deleteUser("manu033@gmail.com");
    expect(userRepo.deleteUser).toHaveBeenCalledWith("manu033@gmail.com");
  });

  it('HU1E05. User registration with email already registered in the system with another account (Invalid Scenario)', async () => {
    let callCount = 0;
    spyOn(userRepo, 'createUser').and.callFake((nombre, apellidos, email, user, password) => {
      callCount++;
      if (callCount == 2 && email === "manu034@gmail.com") 
        return Promise.reject(new MailExistingException());
        
      const createdUser: User = new User(nombre, apellidos, email, user);
      return Promise.resolve(createdUser);
    });

    spyOn(userRepo, 'deleteUser').and.resolveTo();
    
    // GIVEN: El usuario JorgeGarcía no está registrado en el sistema y se tiene conexión con la base de datos. ListaUsuarios=[{Nombre=”Manuel”, Apellido=”García”, User=”Manu33”, Email=”manu33@gmail.com”, Contraseña=”Manu-33”}].
    await service.createUser("Manuel", "García", "manu034@gmail.com", "Manu-34", "Manu-34");
    expect(userRepo.createUser).toHaveBeenCalledWith("Manuel", "García", "manu034@gmail.com", "Manu-34", "Manu-34");
    /* WHEN: Jorge intenta registrarse → [Nombre=”Jorge”, Apellido=”García”, User=”JorgeGarcía”, Email=”manu33@gmail.com”, Contraseña=”JorgeGarcía-02”].
       THEN: El sistema no registra al usuario y se lanza la excepción MailExistingException().
    */
    await expectAsync(
      service.createUser("Jorge", "García", "manu034@gmail.com", "JorgeGarcía", "JorgeGarcía-02")
    ).toBeRejectedWith(new MailExistingException());
    
    service.deleteUser("manu034@gmail.com");
    expect(userRepo.deleteUser).toHaveBeenCalledWith("manu034@gmail.com");
  });
});
