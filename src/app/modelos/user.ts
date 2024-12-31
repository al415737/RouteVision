import { Place } from "./place";
import { Vehiculo } from "./vehiculos/vehiculo";

export class User {
    private nombre: string;
    private apellidos: string;
    private email: string;
    private user: string;
    private preferencia1: string;
    private preferencia2: string;

    constructor (nombre: string, apellidos: string, email: string, user: string, pref1: string, pref2: string) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.user = user;
        this.preferencia1 = pref1;
        this.preferencia2 = pref2;
    }
    getNombre() {
        return this.nombre;
    }
    getApellidos() {
        return this.apellidos;
    }

    getEmail() {
        return this.email;
    }
    getUser() {
        return this.user;
    }
    getPref1() {
        return this.preferencia1;
    }
    getPref2() {
        return this.preferencia2;
    }

}