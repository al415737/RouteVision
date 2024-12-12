import { Routes } from '@angular/router';

export default [
  {
    path: 'sign-up',
    loadComponent: () => import('./sign-up/sign-up.component'),
  },
] as Routes;