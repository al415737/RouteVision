export class Place {
    public idPlace: string;
    private toponimo: string;
    private coordenadas: number[];

    constructor (idPlace: string, toponimo: string, coordenadas: number[]) {
        this.idPlace = idPlace
        this.toponimo = toponimo;
        this.coordenadas = coordenadas;
    }
}