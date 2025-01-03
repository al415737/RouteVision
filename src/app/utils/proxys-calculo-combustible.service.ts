import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PrecioCarburantes } from '../APIs/PrecioCarburantes/precioCarburantes.service';
import { PrecioLuzService } from '../APIs/PrecioLuz/precioLuz.service';

@Injectable({
  providedIn: 'root',
})

export class ProxysCalculoCombustibleService {
  private cacheMunicipios: any | null = null;
  // private cacheGasolineras: any | null = null;
  private cacheEstaciones = new Map<number, any>();
  private cacheLuz: any | null = null;
  private cacheGasolineras: any[] = [];

  constructor(private precioCarburante: PrecioCarburantes, private precioLuz: PrecioLuzService) {}

  async getMunicipios(): Promise<any> {
    if (this.cacheMunicipios == null) {
      this.cacheMunicipios = await firstValueFrom(this.precioCarburante.getMunicipios());
    }
    return this.cacheMunicipios;
  }

  async getEstacionesEnMunicipio(idMunicipio: number): Promise<any> {
    if (!this.cacheEstaciones.has(idMunicipio)) {
      const estaciones = await firstValueFrom(this.precioCarburante.getEstacionesEnMunicipio(idMunicipio));
      this.cacheEstaciones.set(idMunicipio, estaciones);
    }
    return this.cacheEstaciones.get(idMunicipio);
  }

  async getPreciosLuz(): Promise<any>{
    if (this.cacheLuz == null) {
      this.cacheLuz = await firstValueFrom(this.precioLuz.getPrecios());
    }
    return this.cacheLuz;
  }
}