import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PrecioCarburantes {

  constructor(private http: HttpClient) {}

  getMunicipios(): Observable<any> {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Municipios/`;
    return this.http.get(url);
  }

  getEstacionesEnMunicipio(idMunicipio: number): Observable<any> {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`;
    return this.http.get(url);
  }
}
