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
import { NotAvailableFuelException } from '../../excepciones/not-available-fuel-exception';

@Injectable({
  providedIn: 'root'
})

export class RouteFirebaseService implements RouteRepository{
  
  servicioAPI: OpenRouteService = inject(OpenRouteService);

  constructor(private _firestore: FirestoreService, private proxy: ProxysCalculoCombustibleService,  private _geocoding: OpenRouteService, private _authState: AuthStateService) {}
  
  consultarRutaEspecifica(ruta: Route): Promise<boolean> {
    const uid = getAuth().currentUser?.uid;
    const PATHROUTE = `ruta/${uid}/listaRutasInterés`;
    return this._firestore.ifExist("nombre", ruta.getNombre(), PATHROUTE);  //Comprobar si la ruta específica existe
  }
  
  async calcularRuta(origen: Place, destino: Place, metodoMov: string) {
    if(!this._firestore.ifExistPlace(origen) || !this._firestore.ifExistPlace(destino)){ 
      throw new PlaceNotFoundException();
    }

      return firstValueFrom(this._geocoding.getRuta(origen.getCoordenadas().join(','), destino.getCoordenadas().join(','), metodoMov));
  }

  










  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route,): Promise<number> {
    const existVehiculo = this._firestore.ifExistVehicle(vehiculo);
    
    if (!existVehiculo) return -1;

    let costeRuta: number;
    costeRuta = 0;

    console.log('Hola');  
    if(vehiculo.getTipo() == 'Eléctrico'){
      const fechaHoy = new Date();
      console.log(fechaHoy);

      const indiceHora = fechaHoy.getHours(); // Obtener la hora (0-23)
      console.log(indiceHora);

      fechaHoy.setMinutes(0, 0, 0); // Redondea la hora a las 00 minutos, 00 segundos y 00 milisegundos
      console.log(fechaHoy);
      
      const horaActual = fechaHoy.toISOString().split('T')[1].split('.')[0]; // Obtiene solo la hora exacta (HH:00:00)
      console.log(horaActual);


      const listaPrecios = await this.proxy.getPreciosLuz();
      console.log(listaPrecios);


      // Buscar el precio correspondiente a la hora actual
      const pvpc = listaPrecios.included.find((item: any) => item.type === 'PVPC');
      console.log(pvpc);
      if (pvpc) {
        // Extraemos los valores de precio
        const precios = pvpc.attributes.values;
        
        // Buscar el precio correspondiente a la hora actual (sin minutos ni segundos)
        const precioHora = precios.find((item: { datetime: string; value: number }) => {
          const horaApi = item.datetime.split('T')[1].split('.')[0]; // Hora de la API (HH:00:00)
          return horaApi === horaActual;
        });

        if (precioHora) {
          const precioKWh = precioHora.value / 1000; // Convertir €/MWh a €/kWh
          costeRuta = vehiculo.obtenerCoste(ruta.getKm(), precioKWh);
          console.log(`Hora actual: ${horaActual}, Precio €/kWh: ${precioKWh}, Coste Ruta: ${costeRuta}`);
        } else {
            console.log(`No se encontró el precio para la hora ${horaActual}`);
        }
      } else {
          console.error('No se encontró el tipo PVPC en la respuesta de la API');
      }
    } else {
      console.log('Hola1');  

      const listaMunicipios = await this.proxy.getMunicipios();

      const municipio = listaMunicipios.find((Municipio: any) => Municipio.Municipio === ruta.getOrigen());
      const idMunicipio = municipio.IDMunicipio;
  
      const estacionesEnMunicipio = await this.proxy.getEstacionesEnMunicipio(idMunicipio);
      console.log('Hola2');  
      console.log(estacionesEnMunicipio.ListaEESSPrecio);

      let precioGasolinera;
      if(vehiculo.getTipo() == 'Gasolina'){
        precioGasolinera = estacionesEnMunicipio.ListaEESSPrecio[0]["Precio Gasolina 95 E5"];
        console.log(precioGasolinera);
      } else { 
        precioGasolinera = estacionesEnMunicipio.ListaEESSPrecio[0]["Precio Gasoleo A"]
        console.log(precioGasolinera); 
      }

      console.log(`Kilómetros: ${ruta.getKm()}, Precio: ${precioGasolinera}`);
      costeRuta = vehiculo.obtenerCoste(ruta.getKm(), precioGasolinera);
      console.log(costeRuta + 'jjhhh');
    }

    console.log('El coste de la ruta es: ' + costeRuta + '€');
    return costeRuta;
  }











  async costeRutaPieBicicleta(ruta: Route, origen: Place, destino: Place){
    const rutaAPI: any = await this.calcularRuta(origen, destino, ruta.getMovilidad());
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
    const existPlace: boolean = await this._firestore.ifExistPlace(start);
    const existPlace2: boolean = await this._firestore.ifExistPlace(end);
    if(!existPlace || !existPlace2)
      throw new NotExistingObjectException();

    const response: any = await this._geocoding.getRouteFSE(start.getCoordenadas(), end.getCoordenadas(), movilidad, preferencia);
    return response;
  }

  async createRoute(nombre: string, start: Place, end: Place, movilidad: string, preferencia: string, km: number, duracion: number, favorito: boolean): Promise<Route> {
    const existPlace: boolean = await this._firestore.ifExistPlace(start);
    const existPlace2: boolean = await this._firestore.ifExistPlace(end);
  
    if(!existPlace || !existPlace2)
      throw new NotExistingObjectException();
  
    const newRoute: Route = new Route(nombre, start.getToponimo(), end.getToponimo(), preferencia, movilidad, km, duracion, favorito);
    const uid = this._authState.currentUser?.uid;
  
    await this._firestore.createRoute(newRoute, `ruta/${uid}/listaRutasInterés`);
  
    return newRoute;
  }
  
  async deleteRoute(nombre: string): Promise<boolean> {
    if (this._authState.currentUser == null) {
      throw new ServerNotOperativeException();
    }
    const uid = this._authState.currentUser?.uid;
    await this._firestore.deleteRoute(`ruta/${uid}/listaRutasInterés`, nombre);
    return true;
  }

  async getRoutes(): Promise<Route[]> {
    return await this._firestore.getRoutes();
  }
}


