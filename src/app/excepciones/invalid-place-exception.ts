export class InvalidPlaceException extends Error {
    constructor() {
      super("Has puesto un topónimo erróneo."); 
    }
}