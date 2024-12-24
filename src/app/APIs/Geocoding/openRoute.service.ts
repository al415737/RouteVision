import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {

  private apiKey: string = '5b3ce3597851110001cf624838a5b428b37d48899c94060b843a8b87';
  constructor(private http: HttpClient) { }

  getToponimo(coordenadas: number[]) {
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${this.apiKey}&point.lon=${coordenadas[1]}&point.lat=${coordenadas[0]}&boundary.circle.radius=1`;
    return this.http.get(url);
  }

  getCoordenadas(toponimo: string) {
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${this.apiKey}&text=${toponimo}`;
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
