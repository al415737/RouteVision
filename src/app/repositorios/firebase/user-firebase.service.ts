import { Injectable } from '@angular/core';
import { UserRepository } from '../interfaces/user-repository';
import { User } from '../../modelos/user';
import { FirestoreService } from './firestore.service';
import { Place } from '../../modelos/place';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { AuthService } from './auth.service';
import { getAuth, UserCredential } from 'firebase/auth';
import { UserNotFoundException } from '../../excepciones/user-not-found-exception';


const PATH = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService implements UserRepository{

  constructor(private _firestore: FirestoreService, private _auth: AuthService) { }

  async consultarUsuarios(): Promise<User[]> {
      return await this._firestore.consultarUsuarios(PATH);
  }

  async createUser(nombre: string, apellidos: string, email: string, user: string, password: string): Promise<User>{
    const userRegister: User = new User(nombre, apellidos, email, user);
    
    await this._firestore.createUser(userRegister, password);
    return userRegister;
  }

  async deleteUser(email: string): Promise<void> {
    const id = await this._firestore.get('email', email, 'user');
    await this._firestore.deleteUser(id, 'user');
  }

  async loginUser(email: string, password: string): Promise<[Vehiculo[], Place[]]> {
    const userCredential: UserCredential = await this._auth.signin(email, password);
    const uid = userCredential.user.uid;

    const places = await this._firestore.getPlaces();
    const vehiculos = await this._firestore.consultarVehiculo(`vehiculo/${uid}/listaVehiculos`);

    return [vehiculos, places];
  }

  async logoutUser(): Promise<void> {
    await this._auth.logout();
  }
}
