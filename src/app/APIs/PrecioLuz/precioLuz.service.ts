import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PrecioLuzService {
  private http = inject(HttpClient)

  //constructor(private datePipe: DatePipe) {}
  
  getPrecios(): Observable<any>{
    
    //const startDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + 'T00:00';
    //const endDate = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd') + 'T00:00';

    //const url = `api/es/datos/mercados/precios-mercados-tiempo-real?start_date=${startDate}&end_date=${endDate}&time_trunc=hour`;
    const url = 'hola';
    const headers = new HttpHeaders({
          'Accept': 'application/json,',
          'Content-Type': 'application/json',
        });
    return this.http.get(url, { headers });
    
  }
    
}