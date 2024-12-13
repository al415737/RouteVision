export class InvalidEmailException extends Error {
    constructor() {
      super("El correo que has introducido no existe"); 
    }
}