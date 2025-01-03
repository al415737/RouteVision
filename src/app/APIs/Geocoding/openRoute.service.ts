import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {

  private apiKey: string = '5b3ce3597851110001cf62487479b84e9b7e446386382d5668b60fce';
  private baseUrl: string = 'https://api.openrouteservice.org';
  private http = inject(HttpClient)
  constructor() { }


  searchToponimo(name:string): Observable<any>{
    const url = `${this.baseUrl}/geocode/search?api_key=${this.apiKey}&text=${name}&boundary.country=ES&layers=locality`;
    
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.get(url, { headers });
  }

  searchCoordenadas(latitud: any, longitud: any): Observable<any>{
    const url = `${this.baseUrl}/geocode/reverse?api_key=${this.apiKey}&point.lon=${longitud}&point.lat=${latitud}&boundary.country=ES&layers=locality`;
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    return this.http.get(url, { headers });
  }

  getRuta(origen: string, destino: string, metodoMov: string){
      const url = `https://api.openrouteservice.org/v2/directions/${metodoMov}?api_key=${this.apiKey}&start=${origen}&end=${destino}`;
      return this.http.get(url);

  }

  getRouteFSE(start: number[], end: number[], movilidad: string, preferencia: string) {
    return new Promise((resolve) => {
      let request = new XMLHttpRequest();
    
      request.open('POST', `https://api.openrouteservice.org/v2/directions/${movilidad}/geojson`);
    
      request.setRequestHeader('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
      request.setRequestHeader('Content-Type', 'application/json');
      request.setRequestHeader('Authorization', this.apiKey);
    
      request.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const geojson = JSON.parse(this.responseText);
          resolve(geojson);
        }
      };
    
      const body = JSON.stringify({
        coordinates: [start, end],
        preference: preferencia
      });
    
      request.send(body);
    });
  }
}
