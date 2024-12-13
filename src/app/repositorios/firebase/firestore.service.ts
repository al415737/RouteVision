import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { User } from '../../modelos/user';
import { AuthService } from './auth.service';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { getAuth } from 'firebase/auth';
import { Place } from '../../modelos/place';
import { AuthStateService } from '../../utils/auth-state.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private _authState: AuthStateService = inject(AuthStateService);

  private constructor(private _firestore: Firestore, private _auth: AuthService) { }

  async createUser(user: User, password: string) {
    try {
      const userCredential = await this._auth.create(user.getEmail(), password);

      const plainObject = { ...user, uid: userCredential.user.uid };
    
      const _collection = collection(this._firestore, 'user');

    await addDoc(_collection, plainObject);
    } catch (error) {
      throw new MailExistingException();
    }
  }

  async create(object: any, PATH: string) {
    const plainObject = { ...object };
    const _collection = collection(this._firestore, PATH); 
    
    await addDoc(_collection, plainObject);
  }

  async get(campo: string, valor: string, PATH: string) {
    const _collection = collection(this._firestore, PATH);

    const q = query(_collection, where(campo, '==', valor));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) 
      return '';
    
    const firstDocument = querySnapshot.docs[0];

    return firstDocument.id;
  }

  async delete(id: string, PATH: string) {
    const docRef = doc(this._firestore, PATH, id);
    await deleteDoc(docRef);

    if (PATH == 'user')
      await this._auth.delete();
  }

  async getPlaces(){
    const _collection = collection(this._firestore, "place");
    //const consulta = query(_collection, where("uid", '==', this._authState.currentUser?.uid));
    const consulta = query(_collection);

    const docs = await getDocs(consulta);

    return docs.docs.map(doc => { 
      const data = doc.data();
      return new Place(
        data['idPlace'], 
        data['toponimo'],
        data['coordenadas']
      );
     }); 
  }
}

