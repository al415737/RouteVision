import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
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

  signIn(user: User){
    return signInWithEmailAndPassword(this._auth, user.email, user.contraseña);
  }

  signInWithGoogle(){
    const provider = new GoogleAuthProvider();

    //provider.setCustomParameters({prompt: 'select_account'}); Para resolver problema (si hay) de cuenta Google

    return signInWithPopup(this._auth, provider);
  }

}
