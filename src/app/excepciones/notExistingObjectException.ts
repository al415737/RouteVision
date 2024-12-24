export class NotExistingObjectException extends Error{
    constructor() {
        super("Este objeto no existe en su base de datos.");
    }
}