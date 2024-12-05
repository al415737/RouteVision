import { Routes } from '@angular/router';
import { privateGuard, publicGuard } from './core/auth.guard';

export const routes: Routes = [
    {
        canActivateChild: [publicGuard()], 
        path: 'auth',
        loadChildren: () => import('./auth/features/auth.routes')
    },

    {
        canActivateChild: [privateGuard()], 
        path: 'task',
        loadChildren: () => import('./task/features/task.routes')
    },

    {   //para redirigir a Task aunque no haya ninguna ruta puesta en el link O no sea una ruta existente --> localhost:qu4o2i3u4oi123u --> task
        path: '**',
        redirectTo: '/task',
    }
];
