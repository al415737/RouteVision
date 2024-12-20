import { inject, Injectable } from '@angular/core';
import { UserRepository } from '../interfaces/user-repository';
import { User } from '../../modelos/user';
import { FirestoreService } from './firestore.service';
import { Place } from '../../modelos/place';
import { Vehiculo } from '../../modelos/vehiculo';
import { AuthService } from './auth.service';
import { WrongPasswordException } from '../../excepciones/wrong-password-exception';


const PATH = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService implements UserRepository{

  constructor(private _firestore: FirestoreService, private _auth: AuthService) { }

  async createUser(nombre: string, apellidos: string, email: string, user: string, password: string): Promise<User>{
    const userRegister: User = new User(nombre, apellidos, email, user);
    
    await this._firestore.createUser(userRegister, password);
    return userRegister;
  }

  async deleteUser(email: string) {
    const id = await this._firestore.get('email', email, 'user');
    await this._firestore.delete(id, 'user');
  }

  async loginUser(email: string, password: string): Promise<[Vehiculo[], Place[]]> {
    await this._auth.signin(email, password);
    return [[],[]];
  }

  async logoutUser(): Promise<void> {
    await this._auth.logout();
  }
}
