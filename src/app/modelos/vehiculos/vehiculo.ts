export abstract class Vehiculo {
    private matricula: string;
    private marca: string;
    private modelo: string;
    private ano_fabricacion: string;
    private consumo: number;
    private tipo: string;
    private favorito: boolean;

    constructor (matricula: string, marca: string, modelo: string, ano_fabricacion: string, consumo: number, tipo: string, fav: boolean) {
        this.matricula = matricula;
        this.marca = marca;
        this.modelo = modelo;
        this.ano_fabricacion = ano_fabricacion;
        this.consumo = consumo;
        this.tipo = tipo;
        this.favorito = fav;
    }

    getMatricula(): string {
        return this.matricula;
    }

    getConsumo(): number {
        return this.consumo;
    }

    getMarca(){
        return this.marca;
    }

    getModelo(){
        return this.modelo;
    }

    getAñoFabricacion(){
        return this.ano_fabricacion;
    }

    getTipo(){
        return this.tipo;
    }

    getFavorito(){
        return this.favorito;
    }

    abstract obtenerCoste(kilometros: number, precio: any): any;
    
}
