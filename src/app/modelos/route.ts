import { or } from "firebase/firestore";

export class Place {
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
}