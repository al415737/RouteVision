import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PrecioCarburantes {

  private baseUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes';

  constructor(private http: HttpClient) {}

  // getGasolineras(): Observable<any>{
  //   const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/`;
  //   return this.http.get(url);
  // }

  getMunicipios(): Observable<any> {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/Municipios/`;
    return this.http.get(url);
  }

  getEstacionesEnMunicipio(idMunicipio: number): Observable<any> {
    const url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idMunicipio}`;
    return this.http.get(url);
  } 
}
