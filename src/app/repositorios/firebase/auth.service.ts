import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { deleteUser, getAuth } from 'firebase/auth';

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

  get currentUser(){
    return getAuth().currentUser;
  }
}
