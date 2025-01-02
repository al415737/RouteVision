export class PrefereneInvalidException extends Error {
    constructor() {
      super("No has seleccionado una preferencia válida."); 
    }
}