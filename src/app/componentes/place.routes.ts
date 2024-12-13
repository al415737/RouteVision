import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./place/place.component')
  },
  //Creo que esto no hace falta
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