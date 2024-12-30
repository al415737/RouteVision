import { InjectionToken } from '@angular/core';
import { User } from "../../modelos/user";
import { Vehiculo } from '../../modelos/vehiculos/vehiculo';
import { Place } from '../../modelos/place';

export const USER_REPOSITORY_TOKEN = new InjectionToken<UserRepository>('UserRepository');

export interface UserRepository {
    createUser(nombre: string, apellidos: string, email: string, user: string, password: string, preferencia1: string, preferencia2: string): Promise<User>;
    consultarUsuarios(): Promise<User[]>;
    deleteUser(email: string): Promise<void>;
    loginUser(email: string, password: string): Promise<[Vehiculo[], Place[]]>;
    logoutUser(): Promise<void>;
}