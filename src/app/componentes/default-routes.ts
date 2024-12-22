import { Routes } from '@angular/router';

export default [
  {
    path: '',
        loadComponent: () => import('./default/default.component'),
},
  
] as Routes;