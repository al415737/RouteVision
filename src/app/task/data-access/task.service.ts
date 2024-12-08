import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

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

  constructor() { }

  create(task: TaskCreate){
    return addDoc(this._collection, task);
  }

}
