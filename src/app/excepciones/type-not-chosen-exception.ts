export class TypeNotChosenException extends Error {
    constructor() {
      super("No has introducido un tipo de ruta."); 
    }
}