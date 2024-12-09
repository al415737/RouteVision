import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { get } from 'firebase/database';
import { Observable } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

// Representa nuestro lugar de interés
export interface Task {
  id: string;
  toponimo: string;
  coordenadas: string;
}

export type TaskCreate = Omit<Task, 'id'> ;

const PATH = 'task';

@Injectable(
  //{providedIn: 'root'} --> se quita pq si no hay bug con la info al cerrar e iniciar sesión (pq era SINGLETON)
)
export class TaskService {

  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);
  private _authState = inject(AuthStateService);
  private _query = query(this._collection, where('userId','==', this._authState.currentUser?.uid));
  
  constructor(){
    console.log(this._authState.currentUser);
  }

  getLugarInteres = toSignal(
    collectionData(this._query, {idField: 'id'}) as Observable<Task[]>,  {initialValue: []}
  );

  getLugar(id: string){
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(task: TaskCreate){
    return addDoc(this._collection, {...task, userId: this._authState.currentUser?.uid, });
  }

  update(task: TaskCreate, id: string){
    const docRef = doc(this._collection, id);
    return updateDoc(docRef, task);
  }

  delete(id: string){
    const docRef = doc(this._collection, id);
    return deleteDoc(docRef);
  }

}
