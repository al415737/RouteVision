import { Component, inject } from '@angular/core';
import { PlaceService } from '../../servicios/place.service';
import { Place } from '../../modelos/place';
import { RouterLink } from '@angular/router';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user';

@Component({
  selector: 'app-place',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './place.component.html',
  styleUrl: './place.component.css'
})
export default class PlaceComponent {
  private _placeService: PlaceService = inject(PlaceService);
  private _userService: UserService = inject(UserService);
  places: Place[] = [];

  async ngOnInit(): Promise<void> {
    this._userService.loginUser("test@test.com", "test123");
    await new Promise(f => setTimeout(f, 1000));
    this.places = await this._placeService.getPlaces();
  }

}
