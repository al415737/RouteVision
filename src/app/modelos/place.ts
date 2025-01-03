export class Place {
    public idPlace: string;
    private toponimo: string;
    private coordenadas: number[];
    private favorito: boolean;
    private municipio: string;

    constructor (idPlace: string, toponimo: string, coordenadas: number[], fav: boolean, municipio: string){
        this.idPlace = idPlace
        this.toponimo = toponimo;
        this.coordenadas = coordenadas;
        this.favorito = fav;
        this.municipio = municipio;
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
    getMunicipio(){
        return this.municipio;
    }
    setFavorito(fav:boolean){
        this.favorito = fav;
    }
}