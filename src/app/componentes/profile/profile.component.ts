import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../home/header/header.component';
import { UserService } from '../../servicios/user.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export default class ProfileComponent {
  private _userService: UserService = inject(UserService);
  nombre: string | undefined = '';
  apellidos: string | undefined = '';
  email: string | undefined = '';
  user: string | undefined = '';
  preferencia1: string | undefined = '';
  preferencia2: string | undefined = '';

  async ngOnInit(){
    const usuario = await this._userService.getUsuario();
    this.nombre = usuario?.getNombre();
    this.apellidos = usuario?.getApellidos();
    this.email = usuario?.getEmail();
    this.user = usuario?.getUser();
    this.preferencia1 = usuario?.getPref1();
    this.preferencia2 = usuario?.getPref2();
  }
}
