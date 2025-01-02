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

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private _authState: AuthStateService = inject(AuthStateService);

  private constructor(private _firestore: Firestore, private _auth: AuthService) { }

  //CREAR ELEMENTOS
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

  async createVehiculo(vehiculo: Vehiculo, path: string) {
    const _collection = collection(this._firestore, path); 
  
    const objetoPlano = { ...vehiculo};
    return addDoc(_collection, objetoPlano);
  }

  async createPlaceC(place: Place, path: string) {
    const _collection = collection(this._firestore, path);

    
    const docRef = doc(_collection, place.idPlace); // Crea una referencia con un ID único
    const idPlace = docRef.id;
    
    const objetoPlano = { ...place, idPlace };   //se sobreescribe el idPlace de la clase

    return setDoc(docRef, objetoPlano);
  }

  async createPlaceT(place: Place, path: string) {
    const _collection = collection(this._firestore, path);
    
    const docRef = doc(_collection, place.idPlace); // Crea una referencia con un ID único
    const idPlace = docRef.id;
    
    const objetoPlano = { ...place, idPlace};   //se sobreescribe el idPlace de la clase -- hemos quitado uid
    return setDoc(docRef, objetoPlano);
  }

  async createRoute(route: Route, path: string) {
    const _collection = collection(this._firestore, path);

    
    const docRef = doc(_collection, route.getNombre()); // Crea una referencia con un ID único
    const nombre = docRef.id;
    
    const objetoPlano = { ...route, nombre }; 

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

  async getVehiculo(matricula:string){
    const _collection = collection(this._firestore, `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos/`);
    // Referencia a la subcolección listaLugares dentro del documento del usuario
    const id = await this.get('matricula', matricula, `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos/`);
    const listaLugaresRef = doc(_collection, id);
    const vehiculo = await getDoc(listaLugaresRef);
    
    if (vehiculo.exists()) {
      const data = vehiculo.data(); // Objeto plano
      if(data['tipo'] == 'Precio Gasolina 95 E5' || data['tipo'] == 'Precio Gasolina 98 E5'){
        const v = new CocheGasolina(
          data['matricula'],
          data['marca'],
          data['modelo'],
          data['año_fabricacion'],
          data['consumo'],
          data['tipo'],
        );
        v.setFavorito(data['favorito']);
        return v;
      } else if(data['tipo'] == 'Precio Gasoleo A' || data['tipo'] == 'Precio Gasoleo B'){
        const v = new CocheDiesel(
          data['matricula'],
          data['marca'],
          data['modelo'],
          data['año_fabricacion'],
          data['consumo'],
          data['tipo'],
        );
        v.setFavorito(data['favorito']);
        return v;
     } else {
      const v = new CocheElectrico(
        data['matricula'],
        data['marca'],
        data['modelo'],
        data['ano_fabricacion'],
        data['consumo'],
        data['tipo'],
      );
      v.setFavorito(data['favorito']);
      return v;
      }
    }
    return null;
  }

  async consultarVehiculo(path: string){
    const _collection = collection(this._firestore, path);

    const q = query(_collection, orderBy('favorito', 'desc'));

    const documentos = await getDocs(_collection);

    return documentos.docs.map(doc => { 
      const data = doc.data();
      if(data['tipo'] == 'Precio Gasolina 95 E5' || data['tipo'] == 'Precio Gasolina 98 E5'){
          const v = new CocheGasolina(
            data['matricula'],
            data['marca'],
            data['modelo'],
            data['ano_fabricacion'],
            data['consumo'],
            data['tipo'],
          );
          v.setFavorito(data['favorito']);
          return v;

      } else if(data['tipo'] == 'Precio Gasoleo A' || data['tipo'] == 'Precio Gasoleo B'){
        const v = new CocheDiesel(
          data['matricula'],
          data['marca'],
          data['modelo'],
          data['ano_fabricacion'],
          data['consumo'],
          data['tipo'],
        );
        v.setFavorito(data['favorito']);
        return v;
      } else {
        const v = new CocheElectrico(
          data['matricula'],
          data['marca'],
          data['modelo'],
          data['ano_fabricacion'],
          data['consumo'],
          data['tipo'],
        );
        v.setFavorito(data['favorito']);
        return v;
      }
     }); 
  }

  async getUsuario(){
    const _collection = collection(this._firestore, `user/`);
    const id = await this.get('uid', this._authState.currentUser?.uid, `user/`);
    const lista = doc(_collection, id);
    const usuario = await getDoc(lista);
    
    if (usuario.exists()) {
      const data = usuario.data(); // Objeto plano
        return new User(
          data['nombre'],
          data['apellidos'],
          data['email'],
          data['user'],
          data['preferencia1'],
          data['preferencia2']
        );
    }
    return null;
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
        data['user'],
        data['preferencia1'],
        data['preferencia2']
      );
    });
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
          data['duration'],
        );
      });
    } catch (error) {
      throw new ServerNotOperativeException();
    }
    
  }
  //BUSCAR/COMPROBAR ELEMENTOS

  //EDITAR ELEMENTOS
  async actualizarVehiculo(vehiculo:Vehiculo, id:string){
    const listaVehiculosRef = doc(
      this._firestore, 
      `vehiculo/${this._authState.currentUser?.uid}/listaVehiculos/${id}`
    );
  
    const plainObject = { ...vehiculo };
    try {
      await updateDoc(listaVehiculosRef, plainObject);
      return vehiculo;
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return vehiculo;
    }
  }
  
  //EDITAR ELEMENTOS
  async actualizarPlace(place:Place, id:string){
    const listaPlaceRef = doc(
      this._firestore, 
      `Lugar/${this._authState.currentUser?.uid}/listaLugares/${id}`
    );
  
    const plainObject = { ...place };
    try {
      await updateDoc(listaPlaceRef, plainObject);
      return place;
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return place;
    }
  }

  //EDITAR ELEMENTOS
  async actualizarRoutes(route:Route, id:string){
    const listaRoutesRef = doc(
      this._firestore, 
      `ruta/${this._authState.currentUser?.uid}/listaRutasInterés/${id}`
    );
  
    const plainObject = { ...route };
    try {
      await updateDoc(listaRoutesRef, plainObject);
      return route;
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      return route;
    }
  }


  //BORRAR ELEMENTOS
  async deleteUser(id: string, PATH: string): Promise<void> {
    const docRef = doc(this._firestore, PATH, id);
    await deleteDoc(docRef);
    await this._auth.delete();      
  }

  async eliminarVehiculo(path: string, id: string):Promise<void>{
    const docRef = doc(this._firestore, path, id);
    await deleteDoc(docRef);
  }

  async deletePlace(path: string, idPlace: string){
    const docRef: DocumentReference = doc(this._firestore, path, idPlace);
    await deleteDoc(docRef);
  }

  async deleteRoute(path: string, nombre: string){
    const docRef: DocumentReference = doc(this._firestore, path, nombre);
    await deleteDoc(docRef);
  }
  //BORRAR ELEMENTOS
}