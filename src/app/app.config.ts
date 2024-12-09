import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
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
    provideRouter(routes, withComponentInputBinding()), 
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"routevisionadis","appId":"1:830065337905:web:91b52baa896fce07269710","storageBucket":"routevisionadis.firebasestorage.app","apiKey":"AIzaSyCRNYco212t9-485Csb1LyYvzHGpWhak08","authDomain":"routevisionadis.firebaseapp.com","messagingSenderId":"830065337905","measurementId":"G-22ZECB7CKQ"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"routevisionadis","appId":"1:830065337905:web:91b52baa896fce07269710","storageBucket":"routevisionadis.firebasestorage.app","apiKey":"AIzaSyCRNYco212t9-485Csb1LyYvzHGpWhak08","authDomain":"routevisionadis.firebaseapp.com","messagingSenderId":"830065337905","measurementId":"G-22ZECB7CKQ"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
