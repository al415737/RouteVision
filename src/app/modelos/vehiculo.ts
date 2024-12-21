export class Vehiculo {
    private matricula: string;
    private marca: string;
    private modelo: string;
    private año_fabricacion: string;
    private consumo: number;

    constructor (matricula: string, marca: string, modelo: string, año_fabricacion: string, consumo: number) {
        this.matricula = matricula;
        this.marca = marca;
        this.modelo = modelo;
        this.año_fabricacion = año_fabricacion;
        this.consumo = consumo;
    }
}
