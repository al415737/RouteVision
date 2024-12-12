import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { USER_REPOSITORY_TOKEN } from './repositorios/interfaces/user-repository';
import { UserFirebaseService } from './repositorios/firebase/user-firebase.service';
import { VEHICULO_REPOSITORY_TOKEN } from './repositorios/interfaces/vehiculo-repository';
import { VehiculoFirebaseService } from './repositorios/firebase/vehiculo-firebase.service';

export const firebaseConfig = {
  apiKey: "AIzaSyCRNYco212t9-485Csb1LyYvzHGpWhak08",
  authDomain: "routevisionadis.firebaseapp.com",
  projectId: "routevisionadis",
  storageBucket: "routevisionadis.firebasestorage.app",
  messagingSenderId: "830065337905",
  appId: "1:830065337905:web:91b52baa896fce07269710",
  measurementId: "G-22ZECB7CKQ"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    { provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService
     },
     {
      provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService
     }
  ]
};
