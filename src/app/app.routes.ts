import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './utils/auth.guard';

export const routes: Routes = [
    {
      canActivateChild: [publicGuard()],
      path: 'default',
      loadChildren: () => import('./componentes/default-routes'),
    },
    {
      canActivateChild: [publicGuard()],
      path: 'auth',
      loadChildren: () => import('./componentes/auth.routes'),
    },
    {
      //canActivateChild: [privateGuard()],
      path: 'home',
      loadChildren: () => import('./componentes/home.routes'),
    },
    /*
    {
      canActivateChild: [privateGuard()],
      path: 'vehiculos
      loadChildren: () => import('./componentes/home.routes'),
    },
    */
    {
      //canActivateChild: [privateGuard()],
      path: 'lugares',
      loadChildren: () => import('./componentes/place.routes'),
    },
    /*
    {
      canActivateChild: [privateGuard()],
      path: 'rutas',
      loadChildren: () => import('./componentes/home.routes'),
    },
    */
    {
      path: '**',
      redirectTo: '/home'
    },
  ];
