import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../home/header/header.component';
import { VehiculoService } from '../../../servicios/vehiculo.service';
import { MatDialog } from '@angular/material/dialog';
import { Vehiculo } from '../../../modelos/vehiculos/vehiculo';
import { DeleteComponent } from '../delete/delete.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-consultar',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MatTableModule ,MatPaginator, MatPaginatorModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './consultar.component.html',
  styleUrl: './consultar.component.css'
})
export default class ConsultarComponent {
    //Datos de ejemplo
    dataSource = new MatTableDataSource<any>(); //Configuración inicial vacía
    vehiculos: Vehiculo[] = [];
    displayedColumns: string[] = ['matricula', 'marca', 'modelo', 'ano_fabricacion', 'consumo', 'tipo', 'favorito', 'edit', 'delete'];
    currentPage = 0;
    readonly dialog = inject(MatDialog);
    private router = inject(Router);
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private servicioVehiculo: VehiculoService){}

    async ngOnInit(): Promise<void>{
      this.obtenerVehiculos();
    }

    async obtenerVehiculos(){
      try {
            const data = await this.servicioVehiculo.consultarVehiculo();
            this.vehiculos = data;
            this.vehiculos = this.vehiculos.sort((a, b) => (b.getFavorito() ? 1 : 0) - (a.getFavorito() ? 1 : 0));
            this.dataSource = new MatTableDataSource<Vehiculo>(this.vehiculos);
            this.dataSource.paginator = this.paginator;
          } catch (err) {
            console.log(err);
          }
    }

    eliminarVehiculo(vehiculo: Vehiculo){
      this.dialog.open(DeleteComponent, {
        data: {matricula: vehiculo.getMatricula()},
      }).afterClosed().subscribe((result) => {
        if (result.borrado) {
          toast.success("El vehiculo se ha borrado correctamente")
          this.obtenerVehiculos();
        } else {
          toast.info("No se ha borrado el vehiculo")
        }
      }); 
    }

    marcarFavorito(vehiculo: Vehiculo){
      this.servicioVehiculo.marcarFavorito(vehiculo, !vehiculo.getFavorito());
      this.obtenerVehiculos();
     
      if(vehiculo.getFavorito() == true){
        toast.success('Vehículo marcado como favorito.');
      } else {
          toast.success('Vehiculo ya no es favorito.');
      }
    }
}
