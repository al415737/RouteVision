import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
import { deleteDoc, doc, DocumentReference, getDocs, query, setDoc, where } from 'firebase/firestore';
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

  async get(campo: string, valor: string, PATH: string) {
    const _collection = collection(this._firestore, PATH);

    const q = query(_collection, where(campo, '==', valor));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) 
      return '';
    
    const firstDocument = querySnapshot.docs[0];

    return firstDocument.id;
  }

  async deleteUser(id: string, PATH: string): Promise<void> {
    const docRef = doc(this._firestore, PATH, id);
    await deleteDoc(docRef);
    await this._auth.delete();      
  }

  async createVehiculo(vehiculo: Vehiculo, path: string) {
      const _collection = collection(this._firestore, path); 
    
      const objetoPlano = { ...vehiculo};
      return addDoc(_collection, objetoPlano);
  }

  async eliminarVehiculo(path: string, id: string):Promise<void>{
      const docRef = doc(this._firestore, path, id);
      await deleteDoc(docRef);
  }

  async consultarVehiculo(path: string){
    const _collection = collection(this._firestore, path);

    const documentos = await getDocs(_collection);

    return documentos.docs.map(doc => { 
      const data = doc.data();
      if(data['tipo'] == 'Precio Gasolina 95 E5' || data['tipo'] == 'Precio Gasolina 98 E5'){
          return new CocheGasolina(
            data['matricula'],
            data['marca'],
            data['modelo'],
            data['año_fabricacion'],
            data['consumo'],
            data['tipo']
          );
      } else if(data['tipo'] == 'Precio Gasoleo A' || data['tipo'] == 'Precio Gasoleo B'){
        return new CocheDiesel(
          data['matricula'],
          data['marca'],
          data['modelo'],
          data['año_fabricacion'],
          data['consumo'],
          data['tipo']
        );
      } else {
        return new CocheElectrico(
          data['matricula'],
          data['marca'],
          data['modelo'],
          data['año_fabricacion'],
          data['consumo'],
          data['tipo']
        );
      }
     }); 
  }

  async consultarUsuarios(path: string){
      const _collection = collection(this._firestore, path);

      const documentos = await getDocs(_collection);

      return documentos.docs.map (doc => {
        const data = doc.data();
        return new User(
          data['nombre'],
          data['apellidos'],
          data['email'],
          data['user']
        );
      });
  }
  
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

  async getPlaces(): Promise<Place[]> {
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

  async ifExistPlace(place: Place) {
    const _collection = collection(this._firestore, `Lugar/${this._authState.currentUser?.uid}/listaLugaresInterés`);

    const q = query(_collection, where('idPlace', '==', place.idPlace));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) 
      return false;
    
    return true;
  }

  async ifExistVehicle(vehicle: Vehiculo) {
    const _collection = collection(this._firestore, `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos`);

    const q = query(_collection, where('matricula', '==', vehicle.getMatricula()));

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) 
      return false;
    
    return true;
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
  
  async createRoute(route: Route, path: string) {
    const _collection = collection(this._firestore, path);

    
    const docRef = doc(_collection, route.getNombre()); // Crea una referencia con un ID único
    const nombre = docRef.id;
    
    const objetoPlano = { ...route, nombre }; 

    return setDoc(docRef, objetoPlano);
  }

  async deleteRoute(path: string, nombre: string){
    const docRef: DocumentReference = doc(this._firestore, path, nombre);
    await deleteDoc(docRef);
  }

  async getRoutes(): Promise<Route[]> {
    try {
      if (this._authState.currentUser == null) {
        throw new ServerNotOperativeException();
      }
      const listaRutasRef = collection(this._firestore, `ruta/${this._authState.currentUser?.uid}/listaRutasInterés`);
      const querySnapshot = await getDocs(listaRutasRef);
      

      return querySnapshot.docs.map(doc => { 
        const data = doc.data();
        return new Route(
          data['nombre'],
          data['origen'],
          data['destino'],
          data['option'],
          data['movilidad'],
          data['kilometros'],
          data['duration']
        );
      });
    } catch (error) {
      throw new ServerNotOperativeException();
    }
    
  }
}