export class Place {
    public idPlace: string;
    private toponimo: string;
    private coordenadas: number[];
    private favorito: boolean;

    constructor (idPlace: string, toponimo: string, coordenadas: number[]) {
        this.idPlace = idPlace
        this.toponimo = toponimo;
        this.coordenadas = coordenadas;
        this.favorito = false;
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

    setFavorito(favorito: boolean){
        this.favorito = true;
    }
}