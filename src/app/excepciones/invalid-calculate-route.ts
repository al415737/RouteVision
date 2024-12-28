export class InvalidCalculateRoute extends Error {
    constructor(){
        super("Argumentos inválidos para calcular la ruta.");
    }
}