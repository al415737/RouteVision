import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toast } from 'ngx-sonner';
import { MapComponent } from '../../map/map.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../home/header/header.component';
import { PlaceService } from '../../../servicios/place.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouteService } from '../../../servicios/route.service';
import { Place } from '../../../modelos/place';
import { CommonModule } from '@angular/common';
import { geoJSON, LatLngExpression, marker, Marker } from 'leaflet';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule, RouterLink, MapComponent, HeaderComponent, MatTooltipModule, CommonModule],
  templateUrl: './add.component.html',
  styleUrl: './add.component.css'
})
export default class AddComponent {
  map:any;
  @ViewChild('mapComponent') mapComponent!: MapComponent; 
  private _router = inject(Router);
  private _placeService = inject(PlaceService);
  private _routeService = inject(RouteService);
  markers: Marker[] = [];
  private routeLayer: any | null = null;
  places: Place[] = [];
  nombre: string = '';
  origen: Place | null = null;
  destino: Place | null = null;
  option: string = '';
  movilidad: string = '';
  kilometros: number = 0;
  duration: number = 0;

  async ngOnInit() {
    await this.loadPlaces();
  }

  async loadPlaces() {
    this.places = await this._placeService.getPlaces();
  }

  async anadirRuta() {
    console.log(this.nombre, this.option, this.movilidad, this.origen, this.destino)
    if (this.nombre.trim() && this.origen != null && this.destino != null && this.option.trim() && this.movilidad.trim()) {
      await this.getRoute();
      await this._routeService.createRoute(this.nombre, this.origen, this.destino, this.movilidad, this.option, this.routeLayer.features[0].properties.summary.distance / 1000, this.routeLayer.features[0].properties.summary.duration / 60);
      toast.success('Ruta añadida correctamente.');
      this._router.navigateByUrl('/rutas');

    } else 
      toast.info('Por favor, rellene todos los campos');
  }

  async visualizarMapa(){
    if (this.nombre.trim() && this.origen != null && this.destino != null && this.option.trim() && this.movilidad.trim()) {
      this.addMarker(this.origen);
      this.addMarker(this.destino);
      await this.getRoute();
      geoJSON(this.routeLayer.routes[0].segments[0].steps).addTo(this.map);
    }
  }

  addMarker(place: Place) {
    const latLng: LatLngExpression = [place.getCoordenadas()[0], place.getCoordenadas()[1]];
    const newMarker = marker(latLng).addTo(this.map).bindPopup(place.getToponimo()).openPopup();
    this.markers.push(newMarker);
  }

  async getRoute() {
    if (this.routeLayer == null && this.nombre.trim() && this.origen != null && this.destino != null && this.movilidad.trim()) {
      if (this.movilidad == 'porDefecto')
        this.routeLayer = await this._routeService.calcularRuta(this.origen, this.destino, this.movilidad);
      else
        this.routeLayer = await this._routeService.getRouteFSE(this.origen, this.destino, this.movilidad, this.option);
    }
  }
  
}
