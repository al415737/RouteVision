import { Injectable } from '@angular/core';
import { UserRepository } from '../interfaces/user-repository';
import { User } from '../../modelos/user';
import { FirestoreService } from './firestore.service';
import { Place } from '../../modelos/place';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { AuthService } from './auth.service';
import { getAuth, UserCredential } from 'firebase/auth';
import { UserNotFoundException } from '../../excepciones/user-not-found-exception';
import { AuthStateService } from '../../utils/auth-state.service';


const PATH = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserFirebaseService implements UserRepository{

  constructor(private _firestore: FirestoreService, private _auth: AuthService, private _authState: AuthStateService) { }
  
  async consultarUsuarios(): Promise<User[]> {
      return await this._firestore.consultarUsuarios(PATH);
  }

  async getUsuario(): Promise<User | null> {
    return await this._firestore.getUsuario();
  }

  async createUser(nombre: string, apellidos: string, email: string, user: string, password: string, preferncia1: string, preferncia2: string): Promise<User>{
    const userRegister: User = new User(nombre, apellidos, email, user, preferncia1, preferncia2);
    
    await this._firestore.createUser(userRegister, password);
    return userRegister;
  }

  async deleteUser(email: string): Promise<void> {
    const id = await this._firestore.get('email', email, `user/`);
    await this._firestore.delete(`user/`, id);
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

  async editUser(type: number, value: string): Promise<void> {
    const user: User | null = await this._firestore.getUsuario();
    if (user != null) {
      const id = await this._firestore.get('uid', this._authState.currentUser?.uid, `user/`);
      switch(type) {
        case 1:
          user.setPref1(value);
          await this._firestore.edit(user, `user/${id}`);
          break;
        case 2:
          user.setPref2(value);
          await this._firestore.edit(user, `user/${id}`);
          break;
      } 
    }
  }
}
