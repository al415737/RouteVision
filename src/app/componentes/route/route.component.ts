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

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [HeaderComponent, MatPaginatorModule, MatTableModule, RouterLink, MatIconModule],
  templateUrl: './route.component.html',
  styleUrl: './route.component.css'
})
export default class RouteComponent {
  private _placeService: PlaceService = inject(PlaceService);
  private _routeService: RouteService = inject(RouteService);
    readonly dialog = inject(MatDialog);
    places: Place[] = [];
    currentPage = 0;
    dataSource = new MatTableDataSource<Place>();
    displayedColumns: string[] = ['toponimo', 'coordenadas', 'delete'];
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
  
    async ngOnInit(): Promise<void> {
      this.places = await this._placeService.getPlaces();
      this.updateDataSource();
    }
  
    async updateDataSource() {
      try {
        const data = await this._placeService.getPlaces();
        this.places = data;
        this.dataSource = new MatTableDataSource<Place>(this.places);
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
