import { InjectionToken } from '@angular/core';
import { User } from "../../modelos/user";
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { Place } from '../../modelos/place';

export const USER_REPOSITORY_TOKEN = new InjectionToken<UserRepository>('UserRepository');

export interface UserRepository {
    createUser(nombre: string, apellidos: string, email: string, user: string, password: string): Promise<User>;
    consultarUsuarios(): Promise<any>;
    deleteUser(email: string): Promise<void>;
    loginUser(email: string, password: string): Promise<[Vehiculo[], Place[]]>;
    logoutUser(): Promise<void>;
}