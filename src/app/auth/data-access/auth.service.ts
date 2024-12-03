import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { ControlContainer } from '@angular/forms';

export interface User {
  email: string;
  contraseña: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _auth = inject(Auth)

  signUp(user: User){
    return createUserWithEmailAndPassword(this._auth, user.email, user.contraseña);
  }

}
