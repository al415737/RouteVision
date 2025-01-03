import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { tileLayer, Map, marker, geoJSON, Marker, LatLngBounds, LatLng, LatLngExpression } from 'leaflet';
import { OpenRouteService } from '../../APIs/Geocoding/openRoute.service';
import { InvalidPlaceException } from '../../excepciones/invalid-place-exception';
import { catchError, map, of, throwError } from 'rxjs';
import { InvalidCoordenatesException } from '../../excepciones/invalid-coordenates-exception';
import { Place } from '../../modelos/place';
import { RouteService } from '../../servicios/route.service';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { Route } from '../../modelos/route';


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
  private routeLayer: any[] = [];
  private bounds: any[] = [];
  private _rutasService = inject(OpenRouteService);
  private routeService = inject(RouteService);
  @Input() selectedOption: string = '';
  @Output() nombreCiudades = new EventEmitter<any[]>();
  @Output() coordenadasSeleccionadas = new EventEmitter<{ lat: number; lng: number }>();
  @Output() lugaresSeleccionados = new EventEmitter<any[]>();
  @Output() sendToRoute = new EventEmitter<{ distance: number; duration: number; costeRuta: number }>()


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
            lugares.push({ nombre: feature, coordenadas: latlng, municipio: response.features[i].properties.region });
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
  
    async getRoute(nombre: string, origen: Place, destino: Place, movilidad: string, option: string, vehiculo: Vehiculo | null) {
      this.reset();
    
      const responseRuta = option === 'porDefecto'
      ? await this.routeService.calcularRuta(origen, destino, movilidad)
      : await this.routeService.getRouteFSE(origen, destino, movilidad, option);
    
      const distance = responseRuta.features[0].properties.summary.distance / 1000;
      const duration = responseRuta.features[0].properties.summary.duration / 60;
      let costeRuta = 0;
     
      if(movilidad === 'foot-walking' || movilidad === 'cycling-regular'){
        let ruta = new Route(nombre, origen.getToponimo(), destino.getToponimo(), option, movilidad, distance, duration, origen.getMunicipio(), 0);
        costeRuta = await this.routeService.costeRutaPieBicicleta(ruta, origen, destino);
      }
      else if(vehiculo != null){
        costeRuta = await this.routeService.obtenerCosteRuta(vehiculo, new Route(nombre, origen.getToponimo(), destino.getToponimo(), option, movilidad, distance, duration, origen.getMunicipio(), 0));
      }

      this.sendToRoute.emit({ distance, duration, costeRuta });
    
      const origenCoords: LatLngExpression = [origen.getCoordenadas()[1], origen.getCoordenadas()[0]];
      const destinoCoords: LatLngExpression = [destino.getCoordenadas()[1], destino.getCoordenadas()[0]];
    
      const marker1 = marker(origenCoords).addTo(this.map).bindPopup(origen.getToponimo());
      const marker2 = marker(destinoCoords).addTo(this.map).bindPopup(destino.getToponimo());
    
      this.listaMarkers.push(marker1, marker2);
    
      const bounds = new LatLngBounds([marker1.getLatLng(), marker2.getLatLng()]);
      this.map.fitBounds(bounds);
    
      const routeLayer = geoJSON(responseRuta).addTo(this.map);
      this.routeLayer.push(routeLayer);
    }
    
    reset() {
      this.listaMarkers.forEach(marker => this.map.removeLayer(marker));
      this.listaMarkers = [];
    
      this.routeLayer.forEach(layer => this.map.removeLayer(layer));
      this.routeLayer = [];
    }
    
}