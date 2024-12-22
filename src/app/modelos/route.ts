import { or } from "firebase/firestore";

export class Route {
    private origen: string;
    private destino: string;
    private trayectoria: string[];
    private kilometros: number;

    constructor (origen: string, destino: string, trayectoria: string[], kilometros: number) {
        this.origen = origen;
        this.destino = destino;
        this.trayectoria = trayectoria;
        this.kilometros = kilometros;
    }

    getKm(): number{
        return this.kilometros;
    }

    getOrigen(): string{
        return this.origen;
    }
}