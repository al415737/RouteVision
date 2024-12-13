export class Place {
    private idPlace: string;
    private toponimo: string;
    private coordenadas: number[];

    constructor (idPlace: string, toponimo: string, coordenadas: number[]) {
        this.idPlace = idPlace
        this.toponimo = toponimo;
        this.coordenadas = coordenadas;
    }

    getIdPlace(){
        return this.idPlace;
    }

    getToponimo(){
        return this.toponimo
    }

    getCoordenadas(){
        return this.coordenadas;
    }
}