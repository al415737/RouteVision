import { Place } from "./place";
import { Vehiculo } from "./vehiculo";

export class User {
    private nombre: string;
    private apellidos: string;
    private email: string;
    private user: string;
    private vehiculos: Vehiculo[];
    private places: Place[];

    constructor (nombre: string, apellidos: string, email: string, user: string) {
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.user = user;
        this.vehiculos = [];
        this.places = [];
    }

}