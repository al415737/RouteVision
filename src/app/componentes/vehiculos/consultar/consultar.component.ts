import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../home/header/header.component';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-consultar',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MatTableModule ,MatPaginator, MatPaginatorModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './consultar.component.html',
  styleUrl: './consultar.component.css'
})
export default class ConsultarComponent {
    //Datos de ejemplo
    vehiculos = new MatTableDataSource<any>(); //Configuración inicial vacía
    displayedColumns: string[] = ['matricula', 'marca', 'modelo', 'anyo_fabricacion', 'consumo', 'tipo', 'delete'];
    currentPage = 0;

    constructor(private servicioVehiculo: VehiculoService){}

    ngOnInit(): void{
        this.obtenerVehiculos();
    }

    obtenerVehiculos(): void{
      from(this.servicioVehiculo.consultarVehiculo()).subscribe({
        next: (data) => {
          this.vehiculos.data = data;   //Cargar los datos obtenidos en la tabla.
        }
      });
    }

    eliminarVehiculo(matricula: string){
      if(confirm('¿Estás seguro de que deseas eliminar este vehículo?')){
          this.servicioVehiculo.eliminarVehiculo(matricula);
          alert('Vehículo eliminado correctamente');
          this.obtenerVehiculos();
      }
    }
}
