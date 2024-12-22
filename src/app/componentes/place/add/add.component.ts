import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Place } from '../../../modelos/place';
import { FirestoreService } from '../../../repositorios/firebase/firestore.service';
import { MapComponent } from '../../map/map.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, RouterLink, MapComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export default class AddComponent {
  map:any;
  @ViewChild('mapComponent') mapComponent!: MapComponent; 
  private _firebaseService = inject(FirestoreService);
  private _router = inject(Router);
  selectedOption: string = '';
  latitude: string = ''; 
  longitude: string = '';
  toponym: string = '';
  nombreCiudad:string = '';

  /*buscarToponimo(){
    if (this.mapComponent) {
      this.mapComponent.buscarToponimo(this.toponym);
    }
  }

  buscarCoordenadas(){
    if (this.mapComponent) {
      this.mapComponent.buscarCoordenadas(this.latitude, this.longitude);
    }
  }*/

  anadirLugar(){
    let prueba = new Place('000', this.nombreCiudad, [parseFloat(this.latitude),parseFloat(this.longitude)]);
    //this._firebaseService.anadirLugar(prueba);
    this._router.navigateByUrl('/lugares');
  }

  
  actualizarLatLong(coordenadas: { lat: number; lng: number }): void {
    this.latitude = coordenadas.lat.toFixed(6);
    this.longitude = coordenadas.lng.toFixed(6);
  }

  actualizarCiudad(nombre:string){
    this.nombreCiudad = nombre;
  }
}