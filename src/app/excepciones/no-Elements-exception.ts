export class NoElementsException extends Error{
    constructor() {
        super("No hay datos para marcar como favoritos.");
    }
}