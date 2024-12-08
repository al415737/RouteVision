import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _firestore: Firestore = inject(Firestore);

  private constructor() { }

  create(object: any, PATH: string) {
    const plainObject = JSON.parse(JSON.stringify(object)); 
    const _collection = collection(this._firestore, PATH); 
    
    addDoc(_collection, plainObject);
  }

  delete(id: string, PATH: string) {
    const _collection = collection(this._firestore, PATH);

    const docRef = doc(_collection, id);

    deleteDoc(docRef);
  }
}
