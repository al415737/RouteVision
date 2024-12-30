import { Place } from "./place";
import { Vehiculo } from "./vehiculos/vehiculo";

export class User {
    private nombre: string;
    private apellidos: string;
    private email: string;
    private user: string;

    constructor (nombre: string, apellidos: string, email: string, user: string) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.user = user;
    }

    getEmail() {
        return this.email;
    }

}