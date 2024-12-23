import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiKey: string = '5b3ce3597851110001cf624838a5b428b37d48899c94060b843a8b87';
  private baseUrl: string = 'https://api.openrouteservice.org';
  private http = inject(HttpClient)
  constructor() { }


  searchToponimo(name:string): Observable<any>{
    const url = `${this.baseUrl}/geocode/search?api_key=${this.apiKey}&text=${name}&boundary.country=ES`;
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.get(url, { headers });
  }

  searchCoordenadas(latitud: any, longitud: any): Observable<any>{
    const url = `${this.baseUrl}/geocode/reverse?api_key=${this.apiKey}&point.lon=${longitud}&point.lat=${latitud}&boundary.country=ES`;
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.get(url, { headers });
  }
}
