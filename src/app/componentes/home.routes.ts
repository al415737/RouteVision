import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./home/home.component')
  },
 /*
    path: 'vehiculos
    loadComponent: () => import(''),
  },
    path: 'lugares'
    loadComponent: () => import(''),
  },
    path: 'rutas
    loadComponent: () => import(''),
  },
*/
] as Routes;