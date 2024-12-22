export class InvalidCalculateRoute extends Error {
    constructor(){
        super("Faltan por introducir argumentos para calcular la ruta.");
    }
}