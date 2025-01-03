export class PreferenceInvalidException extends Error {
    constructor() {
      super("No has seleccionado una preferencia válida."); 
    }
}