import { inject, Injectable } from '@angular/core';
import { Route } from '../../modelos/route';
import { RouteRepository } from '../interfaces/route-repository';
import { FirestoreService } from './firestore.service';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { ProxysCalculoCombustibleService } from '../../utils/proxys-calculo-combustible.service';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { firstValueFrom } from 'rxjs';
import { Place } from '../../modelos/place';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';
import { AuthStateService } from '../../utils/auth-state.service';
import { getAuth } from 'firebase/auth';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';
import { PlaceNotFoundException } from '../../excepciones/place-not-found-exception';
import { NoElementsException } from '../../excepciones/no-Elements-exception';

@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{
  
  servicioAPI: OpenRouteService = inject(OpenRouteService);

  constructor(private _firestore: FirestoreService, private proxy: ProxysCalculoCombustibleService,  private _geocoding: OpenRouteService, private _authState: AuthStateService) {}
  
  async consultarRutaEspecifica(ruta: Route): Promise<boolean> {
    const uid = getAuth().currentUser?.uid;
    const PATHROUTE = `ruta/${uid}/listaRutasInterés`;
    return await this._firestore.ifExist("nombre", ruta.getNombre(), PATHROUTE);  //Comprobar si la ruta específica existe
  }
  
  async calcularRuta(origen: Place, destino: Place, metodoMov: string) {
    const PATH = `Lugar/${this._authState.currentUser?.uid}/listaLugaresInterés`;
    if(!this._firestore.ifExist('idPlace', origen.getIdPlace(), PATH) || !this._firestore.ifExist('idPlace', destino.getIdPlace(), PATH)){ 
      throw new PlaceNotFoundException();
    }

      return firstValueFrom(this._geocoding.getRuta(origen.getCoordenadas().join(','), destino.getCoordenadas().join(','), metodoMov));
  }

  
  //COSTE DE LA RUTA - IRENE
  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route): Promise<number> {
    const existVehiculo = this._firestore.ifExist('matricula', vehiculo.getMatricula(), `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos`);
    
    if (!existVehiculo) 
      throw new NotExistingObjectException();


    let costeRuta: number;
    costeRuta = 0;

    if(vehiculo.getTipo() == 'Electrico'){  //ELECTRICO
      const fechaHoy = new Date();

      const indiceHora = fechaHoy.getHours(); // Obtener la hora (0-23)
      console.log('La hora de la que se saca el precio de la luz (teniendo en cuenta la hora actual es: ' + indiceHora);

      const listaPrecios = await this.proxy.getPreciosLuz();
      // Buscar el precio correspondiente a la hora actual
      const pvpc = listaPrecios.included.find((item: any) => item.type === 'PVPC');

      // Extraemos los valores de precio
      const precios = pvpc.attributes.values;
        
      const precioKWh = precios[indiceHora].value / 1000; // Convertir €/MWh a €/kWh
      costeRuta = vehiculo.obtenerCoste(ruta.getKm(), precioKWh);

    } else {  //DIESEL O GASOLINA
      const listaMunicipios = await this.proxy.getMunicipios();

      const municipio = listaMunicipios.find((Municipio: any) => Municipio.Municipio === ruta.getMunicipio());
      if (municipio == undefined){
        return -2;
      }
      const idMunicipio = municipio.IDMunicipio;
  
      const estacionesEnMunicipio = await this.proxy.getEstacionesEnMunicipio(idMunicipio);
      if (estacionesEnMunicipio.ListaEESSPrecio.length == 0){
        return -1;
      }
      let precioGasolinera;
      if(vehiculo.getTipo() == 'Gasolina'){
        precioGasolinera = estacionesEnMunicipio.ListaEESSPrecio[0]["Precio Gasolina 95 E5"];
      } else { 
        precioGasolinera = estacionesEnMunicipio.ListaEESSPrecio[0]["Precio Gasoleo A"]
      }
      costeRuta = vehiculo.obtenerCoste(ruta.getKm(), precioGasolinera);
    }
    return costeRuta;
  }


  async costeRutaPieBicicleta(ruta: Route, origen: Place, destino: Place){
    let rutaAPI:any = null;
    if (ruta.getOption() === 'porDefecto'){
      rutaAPI = await this.calcularRuta(origen, destino, ruta.getMovilidad());
    }else{
      rutaAPI = await this.getRouteFSE(origen, destino, ruta.getMovilidad(), ruta.getOption());
    } 
    const duracion = (rutaAPI.features[0].properties.summary.duration) / 3600;
    let coste = 0;

    const calorias_bicicleta = 500;
    const calorias_pie = 300;

    if(ruta.getMovilidad() == 'cycling-regular'){
        coste = duracion * calorias_bicicleta;
    } else if(ruta.getMovilidad() == 'foot-walking'){
        coste = duracion * calorias_pie;
    }

    return coste;
  }

  async getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any> {
    const PATH = `Lugar/${this._authState.currentUser?.uid}/listaLugaresInterés`;
    const existPlace: boolean = await this._firestore.ifExist('idPlace',start.getIdPlace(), PATH);
    const existPlace2: boolean = await this._firestore.ifExist('idPlace',end.getIdPlace(), PATH);
    if(!existPlace || !existPlace2)
      throw new NotExistingObjectException();

    const response: any = await this._geocoding.getRouteFSE(start.getCoordenadas(), end.getCoordenadas(), movilidad, preferencia);
    return response;
  }

  async createRoute(nombre: string, start: Place, end: Place, movilidad: string, preferencia: string, km: number, duracion: number, coste:number): Promise<Route> {
    const PATH = `Lugar/${this._authState.currentUser?.uid}/listaLugaresInterés`;
    const existPlace: boolean = await this._firestore.ifExist('idPlace',start.getIdPlace(), PATH);
    const existPlace2: boolean = await this._firestore.ifExist('idPlace',end.getIdPlace(), PATH);
    if(!existPlace || !existPlace2)
      throw new NotExistingObjectException();
  
    const newRoute: Route = new Route(nombre, start.getToponimo(), end.getToponimo(), preferencia, movilidad, km, duracion, start.getMunicipio(), coste);
    const uid = this._authState.currentUser?.uid;

    await this._firestore.create(newRoute.getNombre(), newRoute, `ruta/${uid}/listaRutasInterés`);  
    return newRoute;
  }

  async actualizarRoutes(route: Route): Promise<any> {
    const id = await this._firestore.get('nombre', route.getNombre(), `ruta/${this._authState.currentUser?.uid}/listaRutasInterés`);
    if (id == '') {
      throw new NoElementsException();
    }
    return await this._firestore.edit(route, `ruta/${this._authState.currentUser?.uid}/listaRutasInterés/${id}`);
  }
  
  async deleteRoute(nombre: string): Promise<boolean> {
    if (this._authState.currentUser == null) {
      throw new ServerNotOperativeException();
    }
    const uid = this._authState.currentUser?.uid;
    await this._firestore.delete(`ruta/${uid}/listaRutasInterés`, nombre);
    return true;
  }

  async getRoutes(): Promise<Route[]> {
    if (this._authState.currentUser == null)
      throw new ServerNotOperativeException();
    return await this._firestore.getValues(`ruta/${this._authState.currentUser.uid}/listaRutasInterés`);
  }

  async marcarFavorito(ruta: Route, favorito: boolean): Promise<void> {
      ruta.setFavorito(favorito);
      return this.actualizarRoutes(ruta);
  }

}


