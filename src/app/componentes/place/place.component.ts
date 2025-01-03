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
import { toast } from 'ngx-sonner';


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
  displayedColumns: string[] = ['toponimo', 'coordenadas', 'favorito', 'delete'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  async ngAfterViewInit() {
    this.updateDataSource();
    this.dataSource.paginator = this.paginator;
    console.log('Paginator inicializado:', this.paginator);
    console.log('Datos en el DataSource:', this.dataSource.data);
  }

  async updateDataSource() {
    try {
      const data = await this._placeService.getPlaces();
      this.places = data.sort((a:Place, b:Place) => (b.getFavorito() ? 1 : 0) - (a.getFavorito() ? 1 : 0));
      this.dataSource.data = this.places; 
    } catch (err) {
      console.log(err);
    }
  }

  onDelete(place: Place) {
    this.dialog.open(DeleteComponent, {
      data: {id: place.getIdPlace(), nombre:place.getToponimo()},
    }).afterClosed().subscribe(() => {
      toast.success('Lugar eliminado correctamente.');
      this.updateDataSource();
    });
  }

  marcarFavorito(place: Place){
      this._placeService.marcarFavorito(place, !place.getFavorito());
      this.updateDataSource();
       
      if(place.getFavorito() == true){
        toast.success('Lugar de interés marcado como favorito.');
      } else {
          toast.success('Lugar ya no es favorito.');
      }
  }

}
