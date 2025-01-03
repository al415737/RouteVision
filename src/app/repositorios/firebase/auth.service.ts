import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { deleteUser, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { WrongPasswordException } from '../../excepciones/wrong-password-exception';
import { MailExistingException } from '../../excepciones/mail-existing-exception';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private constructor(private _auth: Auth) { }

  async create(email: string, password: string) {
    try {
      return await createUserWithEmailAndPassword(
        this._auth,
        email, 
        password
      );
    } catch (error) {
      throw new MailExistingException();
    }
  }

  async delete() {
    const currentUser = this._auth.currentUser;

    if(currentUser)
      await currentUser.delete();
  }

  async signin(email: string, password: string) {
    try {
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
