import { Routes } from '@angular/router';

export default [
  
  {
    path: '',
    loadComponent: () => import('./vehiculos/consultar/consultar.component'),
  },
  
  {
    path: 'new',
    loadComponent: () => import('./vehiculos/add/add.component'),
  },

  {
    path: 'eliminar/:id',
    loadComponent: () => import('./vehiculos/delete/delete.component'),
  },

] as Routes;