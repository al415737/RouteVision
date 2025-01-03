import { User } from '../modelos/user';
import { Vehiculo } from '../modelos/vehiculos/vehiculo';
import { CocheGasolina } from '../modelos/vehiculos/cocheGasolina';
import { CocheDiesel } from '../modelos/vehiculos/cocheDiesel';
import { CocheElectrico } from '../modelos/vehiculos/cocheElectrico';
import { Place } from '../modelos/place';
import { Route } from '../modelos/route';

export class DataAdapter {
  static adapt(path: string, data: any): any {
    const rootPath = path.split('/')[0]; // Primer segmento del PATH

    switch (rootPath) {
      case 'user':
        return DataAdapter.toUser(data);
      case 'vehiculo':
        return DataAdapter.toVehiculo(data);
      case 'Lugar':
        return DataAdapter.toPlace(data);
      case 'ruta':
        return DataAdapter.toRoute(data);
      default:
        throw new Error(`No adapter found for path: ${path}`);
    }
  }

  static toUser(data: any): User {
    return new User(
      data['nombre'],
      data['apellidos'],
      data['email'],
      data['user'],
      data['preferencia1'],
      data['preferencia2']
    );
  }

  static toVehiculo(data: any): Vehiculo {
    if (data['tipo'] === 'Precio Gasolina 95 E5' || data['tipo'] === 'Precio Gasolina 98 E5') {
      return new CocheGasolina(
        data['matricula'],
        data['marca'],
        data['modelo'],
        data['año_fabricacion'],
        data['consumo'],
        data['tipo'],
        data['favorito']
      );
    } else if (data['tipo'] === 'Precio Gasoleo A' || data['tipo'] === 'Precio Gasoleo B') {
      return new CocheDiesel(
        data['matricula'],
        data['marca'],
        data['modelo'],
        data['año_fabricacion'],
        data['consumo'],
        data['tipo'],
        data['favorito']
      );
    } else {
      return new CocheElectrico(
        data['matricula'],
        data['marca'],
        data['modelo'],
        data['ano_fabricacion'],
        data['consumo'],
        data['tipo'],
        data['favorito']
      );
    }
  }

  static toPlace(data: any): Place {
    return new Place(
      data['idPlace'], 
      data['toponimo'],
      data['coordenadas'],
      data['favorito'],
      data['municipio']
    );
  }

  static toRoute(data: any): Route {
    return new Route(
      data['nombre'],
      data['origen'],
      data['destino'],
      data['option'],
      data['movilidad'],
      data['kilometros'],
      data['duration'],
      data['favorito'],
      data['municipio'],
      data['coste']
    );
  }
}
