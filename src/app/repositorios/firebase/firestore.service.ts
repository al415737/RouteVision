import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc, DocumentReference, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { User } from '../../modelos/user';
import { AuthService } from './auth.service';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { getAuth } from '@angular/fire/auth';
import { Place } from '../../modelos/place';
import { AuthStateService } from '../../utils/auth-state.service';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';
import { Route } from '../../modelos/route';
import { CocheGasolina } from '../../modelos/vehiculos/cocheGasolina';
import { CocheDiesel } from '../../modelos/vehiculos/cocheDiesel';
import { CocheElectrico } from '../../modelos/vehiculos/cocheElectrico';
import { NotExistingObjectException } from '../../excepciones/notExistingObjectException';
import { DataAdapter } from '../../utils/dataAdapter';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private constructor(private _firestore: Firestore, private _auth: AuthService) { }

  //CREAR ELEMENTOS
  async createUser(user: User, password: string) {
    const userCredential = await this._auth.create(user.getEmail(), password);

    const plainObject = { ...user, uid: userCredential.user.uid };
    
    const _collection = collection(this._firestore, 'user');

    await addDoc(_collection, plainObject);
  }

  async create(id: string, value: any, PATH: string): Promise<void> {
    const _collection = collection(this._firestore, PATH);

    const docRef = doc(_collection, id); // Crea una referencia con un ID único
    const nameID = docRef.id;
    
    const objetoPlano = { ...value, nameID }; 

    return setDoc(docRef, objetoPlano);
  }
  //CREAR ELEMENTOS


  //BUSCAR/COMPROBAR ELEMENTOS
  async getAutoIdReference(collectionPath: string): Promise<DocumentReference> {
    // Crea una referencia con un ID único automáticamente
    const _collection = collection(this._firestore, collectionPath); // Obtener la colección
    const docRef = doc(_collection); // Crear una referencia sin ID especificado
    return docRef; // Retorna la referencia con ID único
  }

  async get(campo: string, valor: string | undefined, PATH: string) {
    const _collection = collection(this._firestore, PATH);

    const q = query(_collection, where(campo, '==', valor));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) 
      return '';
    
    const firstDocument = querySnapshot.docs[0];

    return firstDocument.id;
  }

  async getValue(id: string, PATH: string): Promise<any> {
    const _collection = collection(this._firestore, PATH);
    const lista = doc(_collection, id);
    const value = await getDoc(lista);
    
    if (value.exists()) {
      const data = value.data(); // Objeto plano
        return DataAdapter.adapt(PATH, data);
    }
    return null;
  }

  async getValues(PATH: string): Promise<any> {
    try {
      const listaRef = collection(this._firestore, PATH);
      const querySnapshot = await getDocs(listaRef);

      return querySnapshot.docs.map(doc => { 
        const data = doc.data();
        return DataAdapter.adapt(PATH, data);
      });
    } catch (error) {
      throw new ServerNotOperativeException();
    }
  }

  async ifExist(campo: string, valor: string, path: string){
      const _collection = collection(this._firestore, path);

      const q = query(_collection, where(campo, '==', valor));

      const querySnapshot = await getDocs(q);

      if(querySnapshot.empty){
          return false;
      }

      return true;
  }
  //BUSCAR/COMPROBAR ELEMENTOS

  //EDITAR ELEMENTOS
  async edit(value: any, PATH: string) {
    const listaRef = doc(
      this._firestore, 
      PATH
    );
    const plainObject = { ...value };  
    await updateDoc(listaRef, plainObject);
    return value;  
  }
  //EDITAR ELEMENTOS
 
  //BORRAR ELEMENTOS
  async delete(PATH: string, id: string): Promise<void> {
    const docRef = doc(this._firestore, PATH, id);
    await deleteDoc(docRef);

    if (PATH == `user/`)
      await this._auth.delete();
  }
  //BORRAR ELEMENTOS
}