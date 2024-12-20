import { InjectionToken } from '@angular/core';
import { User } from "../../modelos/user";

export const USER_REPOSITORY_TOKEN = new InjectionToken<UserRepository>('UserRepository');

export interface UserRepository {
    createUser(nombre: string, apellidos: string, email: string, user: string, password: string): Promise<User>;
    deleteUser(email: string): void;
}