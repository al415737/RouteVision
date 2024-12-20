import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc, DocumentReference, getDocs, query, setDoc, where } from 'firebase/firestore';
import { User } from '../../modelos/user';
import { AuthService } from './auth.service';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { Vehiculo } from '../../modelos/vehiculo';
import { getAuth } from '@angular/fire/auth';
import { Place } from '../../modelos/place';
import { AuthStateService } from '../../utils/auth-state.service';
import { ServerNotOperativeException } from '../../excepciones/server-not-operative-exception';

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

  async createVehiculo(vehiculo: Vehiculo, path: string) {
      const _collection = collection(this._firestore, path); 
      const usuario = getAuth().currentUser;
      const uid = usuario?.uid;
    
      const objetoPlano = { ...vehiculo, uid };
      return addDoc(_collection, objetoPlano);
  }

  async eliminarVehiculo(path: string, id: string){
      const docRef = doc(this._firestore, path, id);
      await deleteDoc(docRef);
  }

  async consultarVehiculo(path: string){
    const _collection = collection(this._firestore, path);
    const uid = getAuth().currentUser;

    const consulta = query(_collection, where("uid", '==', uid?.uid));
    const documentos = await getDocs(consulta);

    //Se puede hacer de dos manera: devolviendo directamente objetos planos o transformando los documentos en instancias de la clase vehículo
    return documentos.docs.map(doc => { 
      const data = doc.data();
      return new Vehiculo(
        data['matricula'], 
        data['marca'],
        data['modelo'],
        data['año_fabricacion'],
        data['consumo']
      );
     }); 
  }


  //IRENE ------------------------------------------------------------------------------------------------------------------------

  async getAutoIdReference(collectionPath: string): Promise<DocumentReference> {
    // Crea una referencia con un ID único automáticamente
    const _collection = collection(this._firestore, collectionPath); // Obtener la colección
    const docRef = doc(_collection); // Crear una referencia sin ID especificado
    return docRef; // Retorna la referencia con ID único
  }

  async createPlaceC(place: Place, path: string) {
    const _collection = collection(this._firestore, path);

    
    const docRef = doc(_collection, place.idPlace); // Crea una referencia con un ID único
    const idPlace = docRef.id;
    
    const objetoPlano = { ...place, idPlace };   //se sobreescribe el idPlace de la clase

    return setDoc(docRef, objetoPlano);
  }

  async deletePlace(path: string, idPlace: string){
    const docRef: DocumentReference = doc(this._firestore, path, idPlace);
    await deleteDoc(docRef);
  }

  async createPlaceT(place: Place, path: string) {
    const _collection = collection(this._firestore, path);

    const usuario = getAuth().currentUser;
    //const uid = usuario?.uid;
    
    const docRef = doc(_collection, place.idPlace); // Crea una referencia con un ID único
    const idPlace = docRef.id;
    
    const objetoPlano = { ...place, idPlace};   //se sobreescribe el idPlace de la clase -- hemos quitado uid
    return setDoc(docRef, objetoPlano);
  }

  async getPlaces(): Promise<any[]> {
    try {
      if (this._authState.currentUser == null) {
        throw new ServerNotOperativeException();
      }
        // Referencia a la subcolección listaLugares dentro del documento del usuario
      const listaLugaresRef = collection(this._firestore, `Lugar/${this._authState.currentUser?.uid}/listaLugaresInterés`);
      
      // Obtener todos los documentos de la subcolección
      const querySnapshot = await getDocs(listaLugaresRef);

      return querySnapshot.docs.map(doc => { 
        const data = doc.data();
        return new Place(
          data['idPlace'], 
          data['toponimo'],
          data['coordenadas'],
        );
      }); 
    } catch (error) {
      throw new ServerNotOperativeException();
    }

    
  }
}