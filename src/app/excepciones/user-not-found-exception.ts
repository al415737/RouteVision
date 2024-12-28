export class UserNotFoundException extends Error {
    constructor() {
      super("El usuario no existe o no ha iniciado sesión."); 
    }
}