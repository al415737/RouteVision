export class Place {
    public idPlace: string;
    private toponimo: string;
    private coordenadas: number[];
    private favorito: boolean;

    constructor (idPlace: string, toponimo: string, coordenadas: number[], fav: boolean) {
        this.idPlace = idPlace
        this.toponimo = toponimo;
        this.coordenadas = coordenadas;
        this.favorito = fav;
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