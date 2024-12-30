
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
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';

  describe('VehiculoService', () => {
  let serviceV: VehiculoService;
  let servicioUser: UserService;

  beforeEach(() => {
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
    //GIVEN: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002 = [ ].
    await servicioUser.loginUser("test@test.com", "test123");

    //WHEN: El usuario intenta dar de alta un vehículo → [Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1].
    const resul = await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A');

    //THEN: El sistema registra el vehículo en la parte de la base de datos dirigida a Ana2002 →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].      
    expect(resul).toBeInstanceOf(Vehiculo);
    await serviceV.eliminarVehiculo("1234 BBB"); 
    await servicioUser.logoutUser();
  });

  it('HU9E05. Registro de vehículo sin matricula (Escenario Inválido)', async () => {
    try {
      //Given: El usuario [“Ana2002”, “anita@gmail.com“,“aNa-24”] con listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
      await servicioUser.loginUser("test@test.com", "test123");
      await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A'); 

      try {
        //When: El usuario intenta dar de alta un vehículo → [Matrícula=” ”, Marca=”Seat”, Modelo=”Ibiza”, Año Fabricación=”2003”, Consumo=4.3].
        await serviceV.crearVehiculo("", "Seat", "Ibiza", "2003", 4.3, "Precio Gasolina 98 E5");
      } catch(error){
          //Then: El sistema no registra el vehículo y lanza una excepción NullLicenseException() →  listaVehículos-Ana2002= [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
          expect(error).toBeInstanceOf(NullLicenseException);
      }
    } finally {
        await serviceV.eliminarVehiculo("1234 BBB");
        await servicioUser.logoutUser();
    }
  });

  it('HU10E01. Consulta de vehículos dados de alta (Escenario Válido)', async () => {
  
    //Given: El usuario Ana con la sesión iniciada y la listaVehículos = [{Matrícula=”1234 BBB”, Marca=”Peugeot”, Modelo=”407”, Año Fabricación=”2007”, Consumo=8.1}].
    await servicioUser.loginUser("test@test.com", "test123"); 

    await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasolina 95 E5");
    
    //When: El usuario pide mostrar sus vehículos.
    const vehiculos = await serviceV.consultarVehiculo(); 

    vehiculos.forEach((vehiculo: any) => {
        expect(vehiculo).toBeInstanceOf(Vehiculo);
    });

    serviceV.eliminarVehiculo("1234 BBB");
    await servicioUser.logoutUser();

  });

  it('HU10E04. El usuario accede con una dirección de correo electrónico en la que no tiene datos guardados (Escenario Inválido)', async () => {
      //Given:  El usuario Ana ha accedido con la dirección de correo: test1@test.com donde no tiene datos guardados. ListaVehículos = {}
        await servicioUser.loginUser("test1@test.com", "test123");

      //When: Ana consulta los vehículos.
        const vehiculos = await serviceV.consultarVehiculo();

      //Then: El sistema no muestra ningún dato.
      expect(vehiculos.length).toBe(0);
      await servicioUser.logoutUser();
  }); 

  //HISTORIA 11
  it('H11-E01. Eliminar vehículo existente del sistema (Escenario Válido): ', async () => {
    await servicioUser.loginUser("test@test.com", "test123"); 
    const vehiculoV = await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasolina 95 E5");
    //habrá que añadir atributos cuando se tenga el factory
    
    //let listaVehiculos = await serviceV.consultarVehiculo();  //cojo la lista de vehículos

    await serviceV.eliminarVehiculo(vehiculoV.getMatricula());

    let listaVehiculos = await serviceV.consultarVehiculo();  //cojo la lista de vehículos
    const vehiculoEncontrado = listaVehiculos.find((vehiculo: { matricula: string; }) => vehiculo.matricula === vehiculoV.getMatricula());

    expect(vehiculoEncontrado).toBeUndefined(); //find devuelve undefined
    await servicioUser.logoutUser();
  });

  it('H11-E02. Eliminar vehículo utilizando una matrícula no registrada en la lista de vehículos (Escenario Inválido): ', async () => {
    await servicioUser.loginUser("test@test.com", "test123"); 
    const vehiculo = await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, "Precio Gasolina 95 E5");
    const vehiculoNoExiste = new CocheGasolina("3423 WCX", "Fiat", "Punto", "2016", 8.1, "Precio Gasolina 95 E5", false);
    //habrá que añadir atributos cuando se tenga el factory

    await expectAsync(serviceV.eliminarVehiculo(vehiculoNoExiste.getMatricula()))
    .toBeRejectedWithError(VehicleNotFoundException); // Manejo por tipo de excepción
    serviceV.eliminarVehiculo(vehiculo.getMatricula());
    await servicioUser.logoutUser();
  });

  it('HU12E01. Actualización correcta de un vehículo (Escenario válido):', async () => {
    //GIVEN: El usuario [“Test”, “test@test.com“,“test123”] con la sesión de su cuenta activa y la lista actual de vehículos = [{"1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A'}].
    await servicioUser.loginUser("test@test.com", "test123");
    await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A');

    //WHEN: El usuario quiere actualizar los datos del vehículo “1234 BBB” con la marca = “Peugeot”, modelo = “407”, tipo de combustible = “Precio Gasoleo B”, año de fabricación = “2010” y consumo del vehículo cada 100 km = “7.1”.
    const resul = await serviceV.actualizarVehiculo("1234 BBB", "Peugeot", "407", "2007", 7.1, 'Precio Gasoleo B', false);

    //THEN: Se actualiza los datos del vehículo = {["1234 BBB", "Peugeot", "407", "2007", 7.1, 'Precio Gasoleo B'].
    expect(resul).toBeInstanceOf(Vehiculo);
    await serviceV.eliminarVehiculo("1234 BBB"); 
    await servicioUser.logoutUser();
  });

it('HU12E03. Error al intentar actualizar un vehículo que no existe (Escenario inválido):', async () => {
    //GIVEN: El usuario [“Test”, “test@test.com“,“test123”] con la sesión de su cuenta activa y la lista actual de vehículos = [{"1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A'}].
    await servicioUser.loginUser("test@test.com", "test123");
    await serviceV.crearVehiculo("1234 BBB", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A');

    //WHEN: El usuario quiere actualizar los datos del vehículo “1234 BBB” con la marca = “Peugeot”, modelo = “407”, tipo de combustible = “Precio Gasoleo B”, año de fabricación = “2010” y consumo del vehículo cada 100 km = “7.1”.
    //THEN: Se actualiza la lista actual de vehículos = {{"1234 BBB", "Peugeot", "407", "2007", 7.1, 'Precio Gasoleo B'}.
    await expectAsync(serviceV.actualizarVehiculo("1234 CCC", "Peugeot", "407", "2007", 8.1, 'Precio Gasoleo A', false)).toBeRejectedWith(new NotExistingObjectException());
    await serviceV.eliminarVehiculo("1234 BBB"); 
    await servicioUser.logoutUser();
  });
});
