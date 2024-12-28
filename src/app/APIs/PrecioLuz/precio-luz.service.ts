import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrecioLuzService {
  private http = inject(HttpClient)

  constructor() { }

  getPrecios(): Observable<any>{
    const url = `api/es/datos/mercados/precios-mercados-tiempo-real?start_date=2024-12-20T00:00&end_date=2024-12-21T00:00&time_trunc=hour`;
    const headers = new HttpHeaders({
          'Accept': 'application/json,',
          'Content-Type': 'application/json',
        });
    return this.http.get(url, { headers });
  }
}