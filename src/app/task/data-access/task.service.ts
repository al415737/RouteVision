import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { get } from 'firebase/database';
import { Observable } from 'rxjs';

// Representa nuestro lugar de interés
export interface Task {
  id: string;
  toponimo: string;
  coordenadas: string;
}

export type TaskCreate = Omit<Task, 'id'>;

const PATH = 'task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private _firestore = inject(Firestore);
  private _collection = collection(this._firestore, PATH);
  
  getLugarInteres = toSignal(
    collectionData(this._collection, {idField: 'id'}) as Observable<Task[]>,  {initialValue: []}
  );

  getLugar(id: string){
    const docRef = doc(this._collection, id);
    return getDoc(docRef);
  }

  create(task: TaskCreate){
    return addDoc(this._collection, task);
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
