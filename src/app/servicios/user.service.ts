import { Injectable, Inject, inject } from '@angular/core';
import { UserRepository, USER_REPOSITORY_TOKEN } from '../repositorios/interfaces/user-repository';
import { ObligatoryFieldsException } from '../excepciones/obligatory-fields-exception';
import { UserNotFoundException } from '../excepciones/user-not-found-exception';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _auth = inject(Auth);
  
  constructor(@Inject(USER_REPOSITORY_TOKEN) private userRepo: UserRepository) {}

  createUser(nombre: string, apellidos: string, email: string, user: string, password: string) {
    if (!nombre.trim() || !apellidos.trim() || !email.trim() || !user.trim() || !password.trim())
      throw new ObligatoryFieldsException();

    return this.userRepo.createUser(nombre, apellidos, email, user, password);
  }

  deleteUser(email: string) {
    if (!email.trim())
      throw new ObligatoryFieldsException();

    this.userRepo.deleteUser(email);
  }

  loginUser(email: string, password: string) {
    return this.userRepo.loginUser(email, password);
  }

  async logoutUser(): Promise<void> {
    if (!this._auth.currentUser) {
      throw new UserNotFoundException();
    }
    await this.userRepo.logoutUser();
  }
}