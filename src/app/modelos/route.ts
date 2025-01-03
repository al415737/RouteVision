export class Route {
    private nombre: string;
    private origen: string;
    private destino: string;
    private option: string;
    private movilidad: string;
    private kilometros: number;
    private duration: number;
    private favorito: boolean;
    private municipio: string;
    private coste: number;

    constructor (nombre: string, origen: string, destino: string, option: string, movilidad: string, kilometros: number,
        duration: number, municipio: string, coste: number) {
        this.nombre = nombre;
        this.origen = origen;
        this.destino = destino;
        this.option = option;
        this.movilidad = movilidad;
        this.kilometros = kilometros;
        this.duration = duration;
        this.favorito = false;
        this.municipio = municipio;
        this.coste = coste;
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

    getFavorito(){
        return this.favorito;
    }

    setKm(km: number) {
        this.kilometros = km;
    }

    setDuration(duration: number) {
        this.duration = duration;
    }

    getMunicipio(): string {
        return this.municipio;
    }
    
    setFavorito(favorito: boolean){
        this.favorito = favorito;
    }
}