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

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [HeaderComponent, MatPaginatorModule, MatTableModule, RouterLink, MatIconModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export default class RouteComponent {
  private _routeService: RouteService = inject(RouteService);
  readonly dialog = inject(MatDialog);
  rutas: Route[] = [];
  currentPage = 0;
  dataSource = new MatTableDataSource<Route>();
  displayedColumns: string[] = ['nombre', 'origen', 'destino', 'option', 'movilidad', 'kilometros', 'duration', 'delete'];

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

  onDelete(route: Place) {
    /*this.dialog.open(DeleteComponent, {
      data: {id: place.getIdPlace(), nombre:place.getToponimo()},
    }).afterClosed().subscribe(() => {
      this.updateDataSource();
    });*/
      
  }
}
