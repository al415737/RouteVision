import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./route/route.component')
  },
  {
    path: 'new',
    loadComponent: () => import('./route/add/add.component'),
  },
] as Routes;