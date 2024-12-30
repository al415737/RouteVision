import { or } from "firebase/firestore";

export class Route {
    private nombre: string;
    private origen: string;
    private destino: string;
    private option: string;
    private movilidad: string;
    private kilometros: number;
    private duration: number;
    private favorito: boolean;

    constructor (nombre: string, origen: string, destino: string, option: string, movilidad: string, kilometros: number, duration: number, fav: boolean) {
        this.nombre = nombre;
        this.origen = origen;
        this.destino = destino;
        this.option = option;
        this.movilidad = movilidad;
        this.kilometros = kilometros;
        this.duration = duration;
        this.favorito = fav;
    }

    getNombre() {
        return this.nombre;
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

    setKm(km: number) {
        this.kilometros = km;
    }

    setDuration(duration: number) {
        this.duration = duration;
    }
}