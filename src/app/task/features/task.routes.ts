import { Routes } from "@angular/router";

export default [
    {
        path: '',
        loadComponent: () => import('./task-list/task-list.component'),
    },

    {
        path: 'new',
        loadComponent: () => import('./task-form/task-form.component'),
    },

    {
        path: 'edit/:id',
        loadComponent: () => import('./task-form/task-form.component'),
    }

] as Routes