import { Injectable, Inject } from '@angular/core';
import { UserRepository, USER_REPOSITORY_TOKEN } from '../repositorios/interfaces/user-repository';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(@Inject(USER_REPOSITORY_TOKEN) private userRepo: UserRepository) {}

  createUser(nombre: string, apellidos: string, email: string, user: string, password: string) {
    return this.userRepo.createUser(nombre, apellidos, email, user, password);
  }

  deleteUser(email: string) {
    this.userRepo.deleteUser(email);
  }
}