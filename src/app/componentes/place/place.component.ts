import { Component, inject, ViewChild } from '@angular/core';
import { PlaceService } from '../../servicios/place.service';
import { Place } from '../../modelos/place';
import { HeaderComponent } from "../home/header/header.component";
import { MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DeleteComponent } from './delete/delete.component';


@Component({
  selector: 'app-place',
  standalone: true,
  imports: [HeaderComponent, MatPaginatorModule, MatTableModule, RouterLink, MatIconModule ],
  templateUrl: './place.component.html',
  styleUrl: './place.component.css'
})
export default class PlaceComponent {
  private _placeService: PlaceService = inject(PlaceService);
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

  onDelete(place: Place) {
    this.dialog.open(DeleteComponent, {
      data: {id: place.getIdPlace(), nombre:place.getToponimo()},
    }).afterClosed().subscribe(() => {
      this.updateDataSource();
    });
      
  }
}
