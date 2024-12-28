export class NoRouteFoundException extends Error {
    constructor(){
        super("No existe la ruta en la base de datos");
    }
}