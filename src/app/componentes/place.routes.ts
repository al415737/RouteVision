import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./place/place.component')
  },
  {
    path: 'new',
    loadComponent: () => import('./place/add/add.component'),
  },
] as Routes;