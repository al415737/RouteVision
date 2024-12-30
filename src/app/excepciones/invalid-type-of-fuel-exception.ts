export class InvalidTypeFuelException extends Error {
    constructor() {
      super("Tipo de gasolina introducido no es correcto."); 
    }
}