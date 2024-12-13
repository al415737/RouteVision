import { Component, inject } from '@angular/core';
import { PlaceService } from '../../servicios/place.service';
import { Place } from '../../modelos/place';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-place',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './place.component.html',
  styleUrl: './place.component.css'
})
export default class PlaceComponent {
  private _placeService: PlaceService = inject(PlaceService);
  places: Place[] = [];

  async ngOnInit(): Promise<void> {
    this.places = await this._placeService.getPlaces();
  }

}
