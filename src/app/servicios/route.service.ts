import { Place } from '../modelos/place';
import { ROUTE_REPOSITORY_TOKEN, RouteRepository } from '../repositorios/interfaces/route-repository';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { TypeNotChosenException } from '../excepciones/type-not-chosen-exception';
import { InvalidCalculateRoute } from '../excepciones/invalid-calculate-route';
import { Inject, Injectable } from '@angular/core';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../repositorios/interfaces/vehiculo-repository';
import { Vehiculo } from '../modelos/vehiculos/vehiculo';
import { Route } from '../modelos/route';
import { NotExistingObjectException } from '../excepciones/notExistingObjectException';
import { NoRouteFoundException } from '../excepciones/no-route-found-exception';
import { IncorrectMethodException } from '../excepciones/incorrect-method-exception';


@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(@Inject(ROUTE_REPOSITORY_TOKEN) private routeRepository: RouteRepository, @Inject(VEHICULO_REPOSITORY_TOKEN) private servicioVehículo: VehiculoRepository) { }

  async calcularRuta(origen: Place, destino: Place, metodoMov: string) {
      if(metodoMov != 'driving-car' && metodoMov != 'cycling-regular' && metodoMov != 'foot-walking' && metodoMov != 'foot-hiking'){
          throw new IncorrectMethodException();
      }

      return await this.routeRepository.calcularRuta(origen, destino, metodoMov);
  }

  async obtenerCosteRuta(vehiculo: Vehiculo, ruta: Route){
    const vehiculosUsuario = this.servicioVehículo.consultarVehiculo();

    for(const vehiculoU of await vehiculosUsuario) {
      if (vehiculoU.getMatricula() == vehiculo.getMatricula())
        //calcular coste ruta llamando a api
        return await this.routeRepository.obtenerCosteRuta(vehiculo, ruta);
    }

    throw new NotExistingObjectException();
  }

  // Conseguir una ruta rápida, corta o económica
  async getRouteFSE(start: Place, end: Place, movilidad: string, preferencia: string): Promise<any> {
    if (!preferencia.trim())
      throw new TypeNotChosenException();

    if (!movilidad.trim() || !preferencia.trim())
      throw new ObligatoryFieldsException();

    return await this.routeRepository.getRouteFSE(start, end, movilidad, preferencia);
  }

  async costeRutaPieBicicleta(ruta: Route, origen: Place, destino: Place){
    if(ruta.getMovilidad() != 'cycling-regular' && ruta.getMovilidad() != 'foot-walking'){
        throw new NoRouteFoundException();
    }

    return await this.routeRepository.costeRutaPieBicicleta(ruta, origen, destino);
  }

  async consultarRutaEspecifica(ruta: Route){
    if(ruta.getOrigen() == '' || ruta.getOrigen() == null || ruta.getDestino() == '' || ruta.getDestino() == null || ruta.getMovilidad() == '' || ruta.getMovilidad() == null){
      throw new InvalidCalculateRoute();
    }
    return await this.routeRepository.consultarRutaEspecifica(ruta);
  }

  async createRoute(nombre: string, start: Place, end: Place, movilidad: string, preferencia: string, km: number, duracion: number, coste: number): Promise<Route> {
    if (!nombre.trim() && !movilidad.trim() && !preferencia.trim() && km > 0 && duracion > 0)
      throw new ObligatoryFieldsException();

    return await this.routeRepository.createRoute(nombre, start, end, movilidad, preferencia, km, duracion, coste);
  }

  async deleteRoute(nombre: string): Promise<boolean> {
    return await this.routeRepository.deleteRoute(nombre);
  }

  async getRoutes(): Promise<Route[]> {
    return await this.routeRepository.getRoutes();
  }

  async marcarFavorito(ruta: Route, favorito: boolean){
      return await this.routeRepository.marcarFavorito(ruta, favorito);
  }

}
