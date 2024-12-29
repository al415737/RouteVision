export class PlaceNotFoundException extends Error {
    constructor() {
      super("El lugar de interés no existe."); 
    }
}