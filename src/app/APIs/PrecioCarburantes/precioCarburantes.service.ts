import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PrecioCarburantes {

    private apiUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

    constructor(private http: HttpClient) { }
  
    getFuelPrices(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }
}
