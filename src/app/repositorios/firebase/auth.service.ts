import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { deleteUser, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { WrongPasswordException } from '../../excepciones/wrong-password-exception';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private constructor(private _auth: Auth) { }

  async create(email: string, password: string) {
    return await createUserWithEmailAndPassword(
      this._auth,
      email, 
      password
    );
  }

  async delete() {
    const currentUser = this._auth.currentUser;

    if(currentUser)
      await deleteUser(currentUser);
  }

  async signin(email: string, password: string) {
    try {
      console.log(email, password);
      return await signInWithEmailAndPassword(
        this._auth, 
        email, 
        password
      );
    } catch (error) {
      throw new WrongPasswordException();
    }
  }

  async logout() {
    return await signOut(this._auth);
  }
}
