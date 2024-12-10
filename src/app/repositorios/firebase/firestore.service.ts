import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc } from 'firebase/firestore';
import { VehiculoRepository } from '../interfaces/vehiculo-repository';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _firestore: Firestore = inject(Firestore);

  private authState = inject(AuthStateService);

  private constructor() { }

  createVehiculo(object: any, PATH: string) { 
    const _collection = collection(this._firestore, PATH); 

    addDoc(_collection, plainObject);
  }

  delete(id: string, PATH: string) {
    const _collection = collection(this._firestore, PATH);

    const docRef = doc(_collection, id);

    deleteDoc(docRef);
  }
}