export class PlaceNotFoundException extends Error{
    constructor() {
        super("Lugar no encontrado en la base de datos.");
    }
}