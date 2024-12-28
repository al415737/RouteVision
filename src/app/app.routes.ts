import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './utils/auth.guard';

export const routes: Routes = [
    {
      canActivateChild: [publicGuard()],
      path: 'default',
      loadComponent: () => import('./componentes/default/default.component'),
    },
    {
      canActivateChild: [publicGuard()],
      path: 'auth',
      loadChildren: () => import('./componentes/auth.routes'),
    },
    {
      canActivateChild: [privateGuard()],
      path: 'home',
      loadComponent: () => import('./componentes/home/home.component')
    },
    
    {
      canActivateChild: [privateGuard()],
      path: 'vehiculos',
      loadChildren: () => import('./componentes/vehicle.routes'),
    },
    
    {
      canActivateChild: [privateGuard()],
      path: 'lugares',
      loadChildren: () => import('./componentes/place.routes'),
    },
    
    {
      canActivateChild: [privateGuard()],
      path: 'rutas',
      loadChildren: () => import('./componentes/route.routes'),
    },
    
    {
      path: '**',
      redirectTo: '/home'
    },
  ];
