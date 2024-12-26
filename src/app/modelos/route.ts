import { or } from "firebase/firestore";

export class Route {
    private nombre: string;
    private origen: string;
    private destino: string;
    private option: string;
    private movilidad: string;
    private kilometros: number;
    private duration: number;

    constructor (nombre: string, origen: string, destino: string, option: string, movilidad: string, kilometros: number, duration: number) {
        this.nombre = nombre;
        this.origen = origen;
        this.destino = destino;
        this.option = option;
        this.movilidad = movilidad;
        this.kilometros = kilometros;
        this.duration = duration;
    }

    getOrigen(): string{
        return this.origen;
    }

    getDestino(): string {
        return this.destino;
    }

    getOption(): string {
        return this.option;
    }

    getMovilidad(): string {
        return this.movilidad;
    }

    getKm(): number{
        return this.kilometros;
    }

    getDuration(): number {
        return this.duration;
    }

    equal(other: Route): boolean {
        return this.origen == other.getOrigen() && this.destino == other.getDestino() && this.option == other.getOption() && this.movilidad == other.getMovilidad();
    }
}