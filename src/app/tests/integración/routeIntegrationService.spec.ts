import { TestBed } from '@angular/core/testing';
import { UserService } from '../../servicios/user.service';
import { User } from '../../modelos/user';
import { MailExistingException } from '../../excepciones/mail-existing-exception';
import { USER_REPOSITORY_TOKEN, UserRepository } from '../../repositorios/interfaces/user-repository';
import { Vehiculo } from '../../modelos/vehiculo';
import { VEHICULO_REPOSITORY_TOKEN, VehiculoRepository } from '../../repositorios/interfaces/vehiculo-repository';
import { VehiculoService } from '../../servicios/vehiculo.service';
import { of } from 'rxjs';
import { NullLicenseException } from '../../excepciones/null-license-exception';
import { UserFirebaseService } from '../../repositorios/firebase/user-firebase.service';
import { VehiculoFirebaseService } from '../../repositorios/firebase/vehiculo-firebase.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { firebaseConfig } from '../../app.config';
import { RouteService } from '../../servicios/route.service';
import { RouteRepository } from '../../repositorios/interfaces/route-repository';

describe('VehiculoIntegrationService', () => {
    let service: UserService;
    let userRepo: UserRepository;

    let vehiculoService: VehiculoService;
    let vehiRepo: VehiculoRepository;

    let routeService: RouteService;
    let routeRepo: RouteRepository;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ 
                provideFirebaseApp(() => initializeApp(firebaseConfig)),     
                provideFirestore(() => getFirestore()),
                provideAuth(() => getAuth()),
                UserService,
                {
                    provide: USER_REPOSITORY_TOKEN, useClass: UserFirebaseService
                },

                VehiculoService,
                {
                    provide: VEHICULO_REPOSITORY_TOKEN, useClass: VehiculoFirebaseService
                }
            ]
        }).compileComponents();

        service = TestBed.inject(UserService);
        userRepo = TestBed.inject(USER_REPOSITORY_TOKEN);

        vehiculoService = TestBed.inject(VehiculoService);
        vehiRepo = TestBed.inject(VEHICULO_REPOSITORY_TOKEN);
    });



});