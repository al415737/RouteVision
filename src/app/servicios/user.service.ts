import { Injectable, Inject, inject } from '@angular/core';
import { UserRepository, USER_REPOSITORY_TOKEN } from '../repositorios/interfaces/user-repository';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { UserNotFoundException } from '../excepciones/user-not-found-exception';
import { Auth } from '@angular/fire/auth';
import { PreferenceInvalidException } from '../excepciones/preference-invalid-exception';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _auth = inject(Auth);
  
  constructor(@Inject(USER_REPOSITORY_TOKEN) private userRepo: UserRepository) {}

  async createUser(nombre: string, apellidos: string, email: string, user: string, password: string) {
    if (!nombre.trim() || !apellidos.trim() || !email.trim() || !user.trim() || !password.trim())
      throw new ObligatoryFieldsException();

    return await this.userRepo.createUser(nombre, apellidos, email, user, password, '', '');
  }

  async consultarUsuarios(){
    return await this.userRepo.consultarUsuarios();
  }

  async getUsuario(){
    return await this.userRepo.getUsuario();
  }

  async deleteUser(email: string | null | undefined):Promise<void> {
    if (!email || !email.trim())
      throw new ObligatoryFieldsException();

    return await this.userRepo.deleteUser(email);
  }

  async loginUser(email: string, password: string) {
    return await this.userRepo.loginUser(email, password);
  }

  async logoutUser(): Promise<void> {
    if (!this._auth.currentUser) {
      throw new UserNotFoundException();
    }
    await this.userRepo.logoutUser();
  }

  async editUser(type: number, value: string) {
    if (type <= 0 || type > 2)
      throw new PreferenceInvalidException();

    if (value != '' && value != 'fastest' && value != 'shortest' && value != 'recommended' && value != 'porDefecto' && value != 'driving-car' && value != 'foot-walking' && value != 'cycling')
      throw new PreferenceInvalidException(); 
    await this.userRepo.editUser(type, value);
  }
}