
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PrecioLuzService {
  private http = inject(HttpClient)
  
  getPrecios(): Observable<any> {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const startDate = today.toISOString().split('T')[0];
    const endDate = tomorrow.toISOString().split('T')[0];

    const url = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?start_date=${startDate}&end_date=${endDate}&time_trunc=hour`;

    return this.http.get(url);
  }
}