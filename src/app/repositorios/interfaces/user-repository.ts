import { InjectionToken } from '@angular/core';
import { User } from "../../modelos/user";
import { Vehiculo } from '../../modelos/vehiculo';
import { Place } from '../../modelos/place';

export const USER_REPOSITORY_TOKEN = new InjectionToken<UserRepository>('UserRepository');

export interface UserRepository {
    createUser(nombre: string, apellidos: string, email: string, user: string, password: string): Promise<User>;
    deleteUser(email: string): void;
    loginUser(email: string, password: string): Promise<[Vehiculo[], Place[]]>;
    logoutUser(): Promise<void>;
}