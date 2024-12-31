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
    path: 'edit/:matricula',
    loadComponent: () => import('./vehiculos/edit/edit.component'),
  },
  

] as Routes;