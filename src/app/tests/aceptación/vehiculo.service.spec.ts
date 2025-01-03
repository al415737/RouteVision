import { TestBed } from '@angular/core/testing';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../app.config';
import { provideFirestore } from '@angular/fire/firestore';
import { getFirestore } from 'firebase/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { VEHICULO_REPOSITORY_TOKEN } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { UserService } from '../../servicios/user.service';
import { USER_REPOSITORY_TOKEN } from '../../repositorios/interfaces/user-repository';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { VehicleNotFoundException } from '../../excepciones/vehicle-not-Found-Exception';
import { CocheGasolina } from '../../modelos/vehiculos/cocheGasolina';
import { CocheDiesel } from '../../modelos/vehiculos/cocheDiesel';
import { NoElementsException } from '../../excepciones/no-Elements-exception';

  describe('VehiculoService', () => {
  let serviceV: VehiculoService;
  let servicioUser: UserService;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),     
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()),
        VehiculoService,
        { provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService },  
        { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService }, 
      ]
    });
    serviceV = TestBed.inject(VehiculoService);
    servicioUser = TestBed.inject(UserService);
  });

  it('HU9E01. Vehículo registrado en el sistema (Escenario Válido)', async () => {
    //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] con listaVehículos= [ ].
    await servicioUser.loginUser("vehicletest@test.com", "test123");

    //WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1, "Diesel"].
    const resul = await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Diesel");

    //THEN: El sistema registra el vehículo en la parte de la base de datos dirigida a Test
    // listaVehículos= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1, "Diesel"}].
    expect(resul).toBeInstanceOf(Vehiculo);
    await serviceV.eliminarVehiculo("1234 BBB"); 
    await servicioUser.logoutUser();
  });

  it('HU9E05. Registro de vehículo sin matricula (Escenario Inválido)', async () => {
    try {
      //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] con listaVehículos= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1, "Precio Gasóleo A"}].
      await servicioUser.loginUser("vehicletest@test.com", "test123");
      await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Diesel'); 

      try {
        //WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=” ”, Marca=”Seat”, Modelo=”Ibiza”, Año Fabricación=”2003”
        // Consumo=4,3, “Gasolina”].
        await serviceV.crearVehiculo("", "Seat", "Ibiza", "2003", 4.3, "Gasolina");
      } catch(error){
        //THEN: l sistema no registra el vehículo y lanza una excepción NullLicenseException() 
        expect(error).toBeInstanceOf(NullLicenseException);
      }
    } finally {
      await serviceV.eliminarVehiculo("1234 BBB");
      await servicioUser.logoutUser();
    }
  });

  it('HU10E01. Consulta de vehículos dados de alta (Escenario Válido)', async () => {
    //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] con la sesión iniciada y la
    // listaVehículos = [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1, “Gasolina”}].
    await servicioUser.loginUser("vehicletest@test.com", "test123");
    await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina");
    
    //WHEN: El usuario pide mostrar sus vehículos.
    const vehiculos = await serviceV.consultarVehiculo(); 

    //THEN: El sistema devuelve la lista de listaVehículos =  [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8,1, “Gasolina”}].
    vehiculos.forEach((vehiculo: any) => {
        expect(vehiculo).toBeInstanceOf(Vehiculo);
    });

    await serviceV.eliminarVehiculo("1234 BBB");
    await servicioUser.logoutUser();

  });

  it('HU10E04. El usuario accede con una dirección de correo electrónico en la que no tiene datos guardados (Escenario Inválido)', async () => {
    //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] ha accedido con la dirección de correo: test1@test.com, donde no tiene datos guardados. ListaVehículos = {}
    await servicioUser.loginUser("test1@test.com", "test123");

    //WHEN: VehicleTest consulta los vehículos.
    const vehiculos = await serviceV.consultarVehiculo();

    //THEN: EEl sistema no consigue mostrar los vehículos.
    expect(vehiculos.length).toBe(0);
    await servicioUser.logoutUser();
  }); 

  //HISTORIA 11
  it('H11E01. Eliminar vehículo existente del sistema (Escenario Válido): ', async () => {
    //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] con la sesión de su cuenta activa y la lista actual de vehículos = [{"1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina"}]. 
    await servicioUser.loginUser("vehicletest@test.com", "test123");
    const vehiculoV = await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina");
    
    //WHEN: El usuario borra el vehículo {"1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina"}.
    await serviceV.eliminarVehiculo(vehiculoV.getMatricula());

    //THEN: El sistema borra el vehículo y actualiza la lista: [].
    let listaVehiculos = await serviceV.consultarVehiculo();  //cojo la lista de vehículos
    const vehiculoEncontrado = listaVehiculos.find((vehiculo: { matricula: string; }) => vehiculo.matricula === vehiculoV.getMatricula());

    expect(vehiculoEncontrado).toBeUndefined(); //find devuelve undefined
    await servicioUser.logoutUser();
  });

  it('H11E02. Eliminar vehículo utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
    //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] con la sesión de su cuenta activa y la lista actual de vehículos = [{"1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina"}]. 
    await servicioUser.loginUser("vehicletest@test.com", "test123");
    const vehiculo = await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Gasolina");
    
    //WHEN: El usuario borra el vehículo {"3423 WCX", "Fiat", "Punto", "2016", 8.1, "Gasolina"”}.
    //THEN: El sistema no borra el vehículo y lanza la excepción VehicleNotFoundException().
    const vehiculoNoExiste = new CocheGasolina("3423 WCX", "Fiat", "Punto", "2016", 8.1, "Gasolina");
    await expectAsync(serviceV.eliminarVehiculo(vehiculoNoExiste.getMatricula()))
    .toBeRejectedWithError(VehicleNotFoundException); // Manejo por tipo de excepción
    
    await serviceV.eliminarVehiculo(vehiculo.getMatricula());
    await servicioUser.logoutUser();
  });

  it('HU12E01. Actualización correcta de un vehículo (Escenario válido):', async () => {
    //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] con la sesión de su cuenta activa y la lista actual de vehículos = [{"1234 BBB", "Peugeot", "407", "2007", 8.1, 'Diesel'}].
    await servicioUser.loginUser("vehicletest@test.com", "test123");
    await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Diesel');
    const comparacion = new CocheDiesel("1234 BBB", "Peugeot", "407", "2007", 7.1, 'Diesel');

    //WHEN: El usuario quiere actualizar los datos del vehículo “1234 BBB” con la marca = “Peugeot”, modelo = “407”, tipo de combustible = “Diesel”, año de fabricación = “2010” y consumo = “7.1”.
    const resul = await serviceV.actualizarVehiculo("1234 BBB", "Peugeot", "407", "2007", 7.1, 'Diesel', false);

    //THEN: Se actualiza los datos del vehículo = {["1234 BBB", "Peugeot", "407", "2007", 7.1, 'Diesel'].
    expect(resul).toBeInstanceOf(Vehiculo);
    expect(resul).toEqual(comparacion);
    await serviceV.eliminarVehiculo("1234 BBB"); 
    await servicioUser.logoutUser();
  });

it('HU12E03. Error al intentar actualizar un vehículo que no existe (Escenario inválido):', async () => {
    //GIVEN: El usuario [“VehicleTest”, “vehicletest@test.com“,“test123”] con la sesión de su cuenta activa y la lista actual de vehículos = [{"1234 BBB", "Peugeot", "407", "2007", 8.1, 'Diesel'}].
    await servicioUser.loginUser("vehicletest@test.com", "test123");
    await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Diesel');

    //WHEN: El usuario quiere actualizar los datos del vehículo “1234 BBB” con la marca = “Peugeot”, modelo = “407”, tipo de combustible = “Diesel”, año de fabricación = “2010” y consumo = “7.1”.
    //THEN: La lista actual de vehículos = [{"1234 BBB", "Peugeot", "407", "2007", 8.1, 'Diesel'}] se mantiene y el sistema lanza una excepción NotExistingObjectException().
    await expectAsync(serviceV.actualizarVehiculo("1234 CCC", "Peugeot", "407", "2007", 8.1, 'Diesel', false)).toBeRejectedWith(new NoElementsException());
    await serviceV.eliminarVehiculo("1234 BBB"); 
    await servicioUser.logoutUser();
  });
});
