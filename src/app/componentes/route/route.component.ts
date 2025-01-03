import { Component, inject, ViewChild } from '@angular/core';
import { PlaceService } from '../../servicios/place.service';
import { Place } from '../../modelos/place';
import { HeaderComponent } from "../home/header/header.component";
import { MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouteService } from '../../servicios/route.service';
import { Route } from '../../modelos/route';
import { DeleteComponent } from './delete/delete.component';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [HeaderComponent, MatPaginatorModule, MatTableModule, RouterLink, MatIconModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export default class RouteComponent {
  private _routeService: RouteService = inject(RouteService);
  private servicioPlace: PlaceService = inject(PlaceService);
  readonly dialog = inject(MatDialog);
  rutas: Route[] = [];
  currentPage = 0;
  dataSource = new MatTableDataSource<Route>();
  displayedColumns: string[] = ['nombre', 'origen', 'destino', 'option', 'movilidad', 'kilometros', 'duration', 'coste', 'favorito','delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  async ngOnInit(): Promise<void> {
    this.rutas = await this._routeService.getRoutes();
    this.updateDataSource();
  }

  async updateDataSource() {
    try {
      const data = await this._routeService.getRoutes();
      this.rutas = data;
      this.dataSource = new MatTableDataSource<Route>(this.rutas);
      this.dataSource.paginator = this.paginator;
    } catch (err) {
      console.log(err);
    }
  }

  onDelete(route: Route) {
    this.dialog.open(DeleteComponent, {
      data: {id: route.getNombre()},
    }).afterClosed().subscribe(() => {
      this.updateDataSource();
    }) ;
  }

  marcarFavorito(route: Route){
      this._routeService.marcarFavorito(route, !route.getFavorito());
      this.updateDataSource();
       
      if(route.getFavorito() == true){
        toast.success('Vehículo marcado como favorito.');
      } else {
        toast.success('Vehiculo ya no es favorito.');
      }
  }
}
