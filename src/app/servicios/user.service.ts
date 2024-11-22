import { Injectable } from '@angular/core';
import { Vehiculo } from '../modelos/vehiculo';

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

  loginUser(user: string, password: string): any {
    return null;
  }
}