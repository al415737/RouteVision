export class ServerNotOperativeException extends Error {
    constructor(){
        super("Fallo en la conexión con el servidor.");
    }
}
