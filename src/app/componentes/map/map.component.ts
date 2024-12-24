import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { tileLayer, Map, marker, geoJSON, Marker, LatLngBounds } from 'leaflet';
import { FirestoreService } from '../../repositorios/firebase/firestore.service';
import { AuthStateService } from '../../utils/auth-state.service';
import { GeocodingService } from '../../APIs/Geocoding/geocoding.service';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { catchError, map, of, throwError } from 'rxjs';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';


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
  private currentMarker2: any | null = null;
  private listaMarkers: Marker[] = [];
  private bounds: any[] = [];
  private _rutasService = inject(GeocodingService);
  @Input() selectedOption: string = '';
  @Output() nombreCiudades = new EventEmitter<any[]>();
  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number; lng: number }>();
  @Output() lugaresSeleccionados = new EventEmitter<any[]>();


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
        if (this.currentMarker2) {
          this.map.removeLayer(this.currentMarker2)
        }
        const coordenadas = {lat: e.latlng.lat, lng: e.latlng.lng};
        this.coordenadasSeleccionadas.emit(coordenadas);
        this.currentMarker2 = marker(e.latlng);
        this.currentMarker2.addTo(this.map)
      }
    }

    buscarToponimo(toponimo: string){
      return this._rutasService.searchToponimo(toponimo).pipe(
        map(response => {
          if (response.features.length === 0) {
            throw new InvalidPlaceException();
          }
    
          if (this.listaMarkers) {
            this.listaMarkers.forEach(marker => this.map.removeLayer(marker));
            this.bounds = [];
          }
          
          let lugares: any[] = [];
          for (let i = 0; i < response.features.length; i++) {
            let latlng = {
              lat: response.features[i].geometry.coordinates[1],
              lng: response.features[i].geometry.coordinates[0]
            };
            const feature = response.features[i].properties.label;
            this.currentMarker = marker(latlng).bindTooltip(feature, {
              permanent: true,
              className: "my-label",
              offset: [0, 0]
            });
            this.currentMarker.addTo(this.map);
            this.listaMarkers.push(this.currentMarker);
            this.bounds.push(this.currentMarker.getLatLng());
            lugares.push({ nombre: feature, coordenadas: latlng });
          }
          this.lugaresSeleccionados.emit(lugares);
          let zoom = new LatLngBounds(this.bounds);
          this.map.fitBounds(zoom);
        }),
        catchError(err => {
          return throwError(() => new InvalidPlaceException());
        })
      );
    }
  
    buscarCoordenadas(latitud: number, longitud: number){
      return this._rutasService.searchCoordenadas(latitud, longitud).pipe(
        map(response => {
          if (response.features.length === 0) {
            throw new InvalidCoordenatesException();
          }
    
          // Limpiar los marcadores anteriores
          this.map.removeLayer(this.currentMarker2);
          if (this.listaMarkers) {
            this.listaMarkers.forEach(marker => this.map.removeLayer(marker));
            this.bounds = [];
          }
    
          let lugares: any[] = [];
          for (let i = 0; i < response.features.length; i++) {
            const feature = response.features[i].properties.name;
            let latlng = {
              lat: response.features[i].geometry.coordinates[1],
              lng: response.features[i].geometry.coordinates[0]
            };
    
            this.currentMarker = marker(latlng).bindTooltip(feature, {
              permanent: true,
              className: "my-label",
              offset: [0, 0]
            });
            this.currentMarker.addTo(this.map);
    
            this.listaMarkers.push(this.currentMarker);
            this.bounds.push(this.currentMarker.getLatLng());
    
            lugares.push({ nombre: feature, coordenadas: latlng });
          }
    
          this.nombreCiudades.emit(lugares);
          let zoom = new LatLngBounds(this.bounds);
          this.map.fitBounds(zoom);
        }),
        catchError(err => {
          return throwError(() => new InvalidCoordenatesException());
        })
      );
    }
}