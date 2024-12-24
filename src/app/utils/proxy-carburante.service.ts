import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PrecioCarburantes } from '../APIs/PrecioCarburantes/precioCarburantes.service';

@Injectable({
  providedIn: 'root',
})
export class ProxyCarburanteService {
  private cacheMunicipios: any | null = null;
  private cacheEstaciones = new Map<number, any>();

  constructor(private precioCarburante: PrecioCarburantes) {}

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
}