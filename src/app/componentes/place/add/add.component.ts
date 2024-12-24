import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { MapComponent } from '../../map/map.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../home/header/header.component';
import { PlaceService } from '../../../servicios/place.service';
import { InvalidPlaceException } from '../../../excepciones/invalid-place-exception';
import { InvalidCoordenatesException } from '../../../excepciones/invalid-coordenates-exception';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, RouterLink, MapComponent, HeaderComponent],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export default class AddComponent {
  map:any;
  @ViewChild('mapComponent') mapComponent!: MapComponent; 
  private _router = inject(Router);
  private _placeService = inject(PlaceService);
  selectedOption: string = '';
  previousSelectedOption: string = '';
  latitude: string = ''; 
  longitude: string = '';
  toponimo: string = '';
  nombreCiudades:any[] = [];
  toponimosEncontrados: any[] = [];
  resultado: any = null;

  buscarToponimo(){
    if (this.mapComponent) {
      if(this.toponimo){
        this.mapComponent.buscarToponimo(this.toponimo).subscribe({
          error: (err) => {
            if (err instanceof InvalidPlaceException) {
              toast.error('El topónimo no es valido.');
            }
          }
        });
      }
      
    }
  }

  buscarCoordenadas(){
    if (this.mapComponent) {
      if (this.latitude && this.longitude) {
        this.mapComponent.buscarCoordenadas(parseFloat(this.latitude), parseFloat(this.longitude)).subscribe({
          error: (err:any) => {
            if (err instanceof InvalidCoordenatesException) {
              toast.error('Las coordenadas no son válidas.');
            }
          }
        });
      }
    }
  }

  anadirLugar(){
    if (this.resultado) {
      if (this.selectedOption === 'coordinates') {
        this._placeService.createPlaceC([this.resultado.coordenadas.lat, this.resultado.coordenadas.lng], this.resultado.nombre);
        
      }else if (this.selectedOption === 'toponym') {
        this._placeService.createPlaceT(this.resultado.nombre, [this.resultado.coordenadas.lat, this.resultado.coordenadas.lng]);
      }
      this._router.navigateByUrl('/lugares');
    }
    
  }

  
  actualizarLatLong(coordenadas: { lat: number; lng: number }): void {
    this.latitude = coordenadas.lat.toFixed(6);
    this.longitude = coordenadas.lng.toFixed(6);
  }

  actualizarCiudad(nombre:any[]){
    this.nombreCiudades = nombre;
  }

  actualizarToponimos(toponimos:any[]){
    this.toponimosEncontrados = toponimos;
  }

  onSelectChange(newOption: string) {
    if (newOption !== this.previousSelectedOption) {
      this.resultado = null;  // Limpia los resultados
      this.toponimosEncontrados = [];  // Limpia los topónimos
      this.nombreCiudades = [];  // Limpia las ciudades
      this.latitude = '';  // Limpia la latitud
      this.longitude = '';  // Limpia la longitud
      this.toponimo = '';  // Limpia el topónimo
      this.previousSelectedOption = newOption;  // Actualiza la opción anterior
    }
  }
  
}