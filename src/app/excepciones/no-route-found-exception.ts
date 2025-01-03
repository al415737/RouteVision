export class NoRouteFoundException extends Error {
    constructor(){
        super("Movilidad incorrecta");
    }
}