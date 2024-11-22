import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  createUser(nombre: string, apellidos: string, email: string, user: string, password: string) {
    return null;
  }

  deleteUser(user: string) {
    return null;
  }

}