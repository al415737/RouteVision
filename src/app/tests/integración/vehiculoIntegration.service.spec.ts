import { TestBed } from '@angular/core/testing';
import { UserService } from '../../servicios/user.service';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../../repositorios/interfaces/user-repository';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../../app.config';
import { CocheGasolina } from '../../modelos/vehiculos/cocheGasolina';
import { CocheDiesel } from '../../modelos/vehiculos/cocheDiesel';
import { VehicleNotFoundException } from '../../excepciones/vehicle-not-Found-Exception';

describe('VehiculoIntegrationService', () => {
    let service: UserService;
    let userRepo: UserRepository;

    let vehiculoService: VehiculoService;
    let vehiRepo: VehiculoRepository;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ 
                provideFirebaseApp(() => initializeApp(firebaseConfig)),     
                provideFirestore(() => getFirestore()),
                provideAuth(() => getAuth()),
                UserService,
                {
                    provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService
                },

                VehiculoService,
                {
                    provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService
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
        const mockData = new CocheDiesel("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasoleo A", false);
        spyOn(vehiRepo, 'crearVehiculo').and.resolveTo(mockData);

        spyOn(vehiRepo, 'eliminarVehiculo').and.resolveTo();

        //WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1].
        const vehiculo = await vehiculoService.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasoleo A");
        
        //THEN: El sistema registra el vehículo en la parte de la base de datos dirigida a Ana2002 →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
        expect(vehiRepo.crearVehiculo).toHaveBeenCalledWith(mockData);
        expect(vehiculo).toEqual(mockData); 

        const resul = vehiculoService.eliminarVehiculo("1234 BBB");
        expect(vehiRepo.eliminarVehiculo).toHaveBeenCalledWith("1234 BBB");
    });

    it('HU9E05. Registro de vehículo sin matricula (Escenario Inválido)', async () => {
        const mockData = new CocheDiesel("", "Peugeot", "407", "2007", 8.1, "Precio Gasoleo A", false);
        spyOn(vehiRepo, 'crearVehiculo').and.resolveTo(mockData);
        
        spyOn(vehiRepo, 'eliminarVehiculo').and.resolveTo();

        //Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].

        try{
            //When: El usuario intenta dar de alta un vehículo → [Matrícula=” ”, Marca=”Seat”, Modelo=”Ibiza”, Año Fabricación=”2003”, Consumo=4.3].
            vehiculoService.crearVehiculo("", "Peugeot", "407", "2007", 8.1,"Precio Gasoleo A")
            expect(vehiRepo.crearVehiculo).toHaveBeenCalledWith(mockData);
            //Then: El sistema no registra el vehículo y lanza una excepción NullLicenseException() →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
        }catch(error){
            expect(error).toBeInstanceOf(NullLicenseException);
        }
    });

    it('HU10E01. Consulta de vehículos dados de alta (Escenario Válido)', async () => {
        //Given: El usuario Ana con la sesión iniciada y la listaVehículos = [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
        const mockData: Vehiculo[] = [
            new CocheDiesel("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasoleo A", false),
        ];
        spyOn(vehiRepo, 'consultarVehiculo').and.resolveTo(Promise.resolve(mockData));

        //When: El usuario pide mostrar sus vehículos.
        const vehiculos = await vehiculoService.consultarVehiculo();
        expect(vehiRepo.consultarVehiculo).toHaveBeenCalled();

        //Then: El sistema devuelve la lista de listaVehículos =  [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1L/100 km}]
        expect(vehiculos).toEqual(mockData);
    });

    it('HU10E04. El usuario accede con una dirección de correo electrónico en la que no tiene datos guardados (Escenario Inválido)', async () => {
        //Given:  El usuario Ana ha accedido con la dirección de correo: test1@test.com donde no tiene datos guardados. ListaVehículos = {}
        const mockData: Vehiculo[] = [];

        spyOn(vehiRepo, 'consultarVehiculo').and.resolveTo(mockData);

        //When: Ana consulta los vehículos.
        const vehiculos = await vehiculoService.consultarVehiculo(); 

        expect(vehiRepo.consultarVehiculo).toHaveBeenCalled();

        //Then: El sistema no muestra ningún dato.
        expect(vehiculos).toEqual(mockData);  
    });


    //HISTORIA 11
    it('PRUEBA INTEGRACIÓN --> H11-E01. Eliminar vehículo existente del sistema (Escenario Válido): ', async () => {
        spyOn(vehiRepo, 'eliminarVehiculo').and.resolveTo();

        const vehiculo = new CocheGasolina("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasolina 95 E5", false);

        const result = await vehiculoService.eliminarVehiculo(vehiculo.getMatricula());
        expect(vehiRepo.eliminarVehiculo).toHaveBeenCalledWith(vehiculo.getMatricula());
        expect(result).toBeUndefined();
    });

    it('PRUEBA INTEGRACIÓN --> H11-E02. Eliminar vehículo utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido):  ', async () => {
        spyOn(vehiRepo, 'eliminarVehiculo').and.resolveTo();

        const vehiculoNoExiste = new CocheGasolina("3423 WCX", "Fiat", "Punto", "2016", 8.1, "Precio Gasolina 95 E5", false);

        try{
            vehiculoService.eliminarVehiculo(vehiculoNoExiste.getMatricula());
            expect(vehiRepo.eliminarVehiculo).toHaveBeenCalledWith(vehiculoNoExiste.getMatricula());
        }catch(error){
            expect(error).toBeInstanceOf(VehicleNotFoundException);
        }
    });
});