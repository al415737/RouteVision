export class NoRouteFoundException extends Error {
    constructor(){
        super("Metodo de viaje inválido.");
    }
}