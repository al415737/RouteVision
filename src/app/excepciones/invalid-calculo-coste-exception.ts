export class InvalidCalculoCosteException extends Error {
    constructor(){
        super("Argumentos inválidos para calcular el coste de la ruta.");
    }
}