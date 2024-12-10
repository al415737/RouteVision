import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../interfaces/user-repository';
import { User } from '../../modelos/user';
import { FirestoreService } from './firestore.service';


const PATH = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService implements UserRepository{

  constructor(private _firestore: FirestoreService) { }

  async createUser(nombre: string, apellidos: string, email: string, user: string, password: string): Promise<User>{
    const userRegister: User = new User(nombre, apellidos, email, user);
    
    await this._firestore.createUser(userRegister, password);
    return userRegister;
  }

  async deleteUser(email: string) {
    const id = await this._firestore.get('email', email, 'user');
    await this._firestore.delete(id, 'user');
  }
}
