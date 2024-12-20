import { TestBed } from '@angular/core/testing';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../../repositorios/interfaces/user-repository';
import { Vehiculo } from '../../modelos/vehiculo';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { of } from 'rxjs';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';

describe('VehiculoIntegrationService', () => {
    let service: UserService;
    let userRepo: UserRepository;

    let vehiculoService: VehiculoService;
    let vehiRepo: VehiculoRepository;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ 
                UserService,
                {
                    provide: USER_REPOSITORY_TOKEN, useValue: UserFirebaseService
                },

                VehiculoService,
                {
                    provide: VEHICULO_REPOSITORY_TOKEN, useValue: VehiculoFirebaseService
                }
            ]
        }).compileComponents();

        service = TestBed.inject(UserService);
        userRepo = TestBed.inject(USER_REPOSITORY_TOKEN);

        vehiculoService = TestBed.inject(VehiculoService);
        vehiRepo = TestBed.inject(VEHICULO_REPOSITORY_TOKEN);
    });

    it('HU9E01. Vehículo registrado en el sistema (Escenario Válido)', async () => {
        //GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002 = [ ].
        const mockData: Vehiculo = new Vehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
        spyOn(vehiRepo, 'crearVehiculo').and.resolveTo(mockData);

        spyOn(vehiRepo, 'eliminarVehiculo').and.resolveTo();

        //WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1].
        const vehiculo = await vehiculoService.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1);
        
        //THEN: El sistema registra el vehículo en la parte de la base de datos dirigida a Ana2002 →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
        expect(vehiRepo.crearVehiculo).toHaveBeenCalledWith("1234 BBB", "Peugeot", "407", "2007", 8.1);
        expect(vehiculo).toEqual(mockData); 

        const resul = vehiculoService.eliminarVehiculo("1234 BBB");
        expect(vehiRepo.eliminarVehiculo).toHaveBeenCalledWith("1234 BBB");
    });

    it('HU9E05. Registro de vehículo sin matricula (Escenario Inválido)', async () => {
        const mockData: Vehiculo = new Vehiculo("", "Peugeot", "407", "2007", 8.1);
        spyOn(vehiRepo, 'crearVehiculo').and.resolveTo(mockData);
        
        spyOn(vehiRepo, 'eliminarVehiculo').and.resolveTo();

        //Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].

        await expectAsync(
            //When: El usuario intenta dar de alta un vehículo → [Matrícula=” ”, Marca=”Seat”, Modelo=”Ibiza”, Año Fabricación=”2003”, Consumo=4.3].
            vehiculoService.crearVehiculo("", "Peugeot", "407", "2007", 8.1)
            //Then: El sistema no registra el vehículo y lanza una excepción NullLicenseException() →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
        ).toBeRejectedWith(new NullLicenseException());
        
        expect(vehiRepo.crearVehiculo).toHaveBeenCalledWith("", "Peugeot", "407", "2007", 8.1);
    });
});