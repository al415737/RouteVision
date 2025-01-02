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
import { UserService } from '../../../servicios/user.service';
import { User } from '../../../modelos/user';
import { Vehiculo } from '../../../modelos/vehiculos/vehiculo';
import { VehiculoService } from '../../../servicios/vehiculo.service';

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
  private _userService = inject(UserService);
  private _vehiculoService = inject(VehiculoService);
  
  user: User | null = null;
  places: Place[] = [];
  vehicles: Vehiculo[] = [];
  vehiculo: Vehiculo | null = null; //para inicializar
  nombre: string = '';
  origen: Place | null = null;
  destino: Place | null = null;
  option: string = '';
  movilidad: string = '';
  kilometros: number = 0;
  duration: number = 0;

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.places = await this._placeService.getPlaces();
    this.user = await this._userService.getUsuario();
    //this.vehicles = await this._vehiculoService.consultarVehiculo();
    //console.log(this.vehicles);

    if (this.user != null){
      this.movilidad = this.user.getPref1();
      this.option = this.user.getPref2();
    } 
  }

  async anadirRuta() {
    console.log(this.nombre, this.option, this.movilidad, this.origen, this.destino)
    if (this.nombre.trim() && this.origen != null && this.destino != null && this.option.trim() && this.movilidad.trim()) {
      await this._routeService.createRoute(this.nombre, this.origen, this.destino, this.movilidad, this.option, this.kilometros, this.duration);
      toast.success('Ruta añadida correctamente.');
      this._router.navigateByUrl('/rutas');

    } else 
      toast.info('Por favor, rellene todos los campos.');
  }

  visualizarMapa() {
    if (this.mapComponent) {
      if (this.origen != null && this.destino != null && this.option.trim() && this.movilidad.trim()) {
        if(this.origen.getIdPlace() != this.destino.getIdPlace())
          this.mapComponent.getRoute(this.origen, this.destino, this.movilidad, this.option, this.vehiculo);
        else
          toast.info('Por favor, indique dos lugares distintos.');
      }
    }
  }

  updateKmDuracion(result: {distance: number, duration: number}) {
    this.kilometros = result.distance;
    this.duration = result.duration;
  }

  
}
