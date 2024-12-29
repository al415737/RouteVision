export class IncorrectMethodException extends Error {
    constructor() {
      super("El método de movilidad elegido no es válido."); 
    }
}