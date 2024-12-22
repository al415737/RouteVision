import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tileLayer, Map, marker, geoJSON } from 'leaflet';
import { FirestoreService } from '../../repositorios/firebase/firestore.service';
import { AuthStateService } from '../../utils/auth-state.service';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})

export class MapComponent {
  map:any;
  private currentMarker: any | null = null;
  //private _rutasService = inject(OrsapiService);
  private _firebaseService = inject(FirestoreService);
  private _authStateService = inject(AuthStateService);
  private _router = inject(Router);
  @Input() selectedOption: string = '';
  @Output() nombreCiudad = new EventEmitter<string>();
  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number; lng: number }>();


  ngAfterViewInit():void{
      this.crearMapa();
  }
  
  crearMapa():void{
    this.map = new Map('map').setView([39.42433, -0.38444], 13);
    tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    this.map.on('click', (e: L.LeafletMouseEvent) => this.anadirMarca(e));
  }

    anadirMarca(e:any) {
      if (this.selectedOption === 'coordinates') {
        console.log("hola")
        if (this.currentMarker) {
          this.map.removeLayer(this.currentMarker)
        }
        const coordenadas = {lat: e.latlng.lat, lng: e.latlng.lng};
        this.coordenadasSeleccionadas.emit(coordenadas);
        this.currentMarker = marker(e.latlng);
        this.currentMarker.addTo(this.map)
      }
    }

    /*buscarToponimo(toponym: string){
      this._rutasService.searchToponimo(toponym).subscribe(
        response => {
          const geojson: GeoJSON.GeoJSON = response;
          if (this.currentMarker) {
            this.map.removeLayer(this.currentMarker)
          }
          this.currentMarker = geoJSON(geojson).addTo(this.map)
          this.map.fitBounds(this.currentMarker.getBounds());
        }
      );
    }
  
    buscarCoordenadas(latitud: string, longitud: string){
      this._rutasService.searchCoordenadas(latitud, longitud).subscribe(
        response => {
          const geojson: GeoJSON.GeoJSON = response;
          let nombre = '';
          geoJSON(geojson, {
            onEachFeature(feature, properties) {
              nombre = feature.properties.name
          }
        });
        this.nombreCiudad.emit(nombre);
        }
      );
    }*/
}