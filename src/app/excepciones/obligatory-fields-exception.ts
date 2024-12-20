export class ObligatoryFieldsException extends Error {
    constructor() {
      super("Todos los campos son obligatorios"); 
    }
}