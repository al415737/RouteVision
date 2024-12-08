import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../interfaces/user-repository';
import { User } from '../../modelos/user';
import { FirestoreService } from './firestore.service';


const PATH = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService implements UserRepository{

  _firestore: FirestoreService = inject(FirestoreService);

  constructor() { }

  async createUser(nombre: string, apellidos: string, email: string, user: string, password: string): Promise<User>{
    const userRegister: User = new User(nombre, apellidos, email, user);
    
    this._firestore.create(userRegister, "user");
    return userRegister;
  }

  async deleteUser(email: string) {
    // Por implementar
  }
}
