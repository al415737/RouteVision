import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class openRouteService {

  private apiKey: string = '5b3ce3597851110001cf6248bb26ad116ed844abb317f5e06971984f';
  constructor(private http: HttpClient) { }

  searchToponimo(name:string): Observable<any>{
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${this.apiKey}&text=${name}&boundary.country=ES`;
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.get(url, { headers });
  }

  getCoordenadas(toponimo: string) {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${this.apiKey}&text=${toponimo}&boundary.country=ES`;
    return this.http.get(url);
  }

  searchCoordenadas(latitud: any, longitud: any): Observable<any>{
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${this.apiKey}&point.lon=${longitud}&point.lat=${latitud}&boundary.country=ES`;
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.get(url, { headers });
  }

  getRuta(origen: string, destino: string, metodoMov: string){
      const url = `https://api.openrouteservice.org/v2/directions/${metodoMov}?api_key=${this.apiKey}&start=${origen}&end=${destino}`;
      return this.http.get(url);

  }
}
