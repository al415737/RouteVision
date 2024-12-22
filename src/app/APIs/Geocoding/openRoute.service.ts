import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class openRouteService {

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

  getRuta(origen: string, destino: string, metodoMov: string){
      const url = `https://api.openrouteservice.org/v2/directions/${metodoMov}?api_key=${this.apiKey}}&start=${origen}&end=${destino}`;
      return this.http.get(url);

  }
}
