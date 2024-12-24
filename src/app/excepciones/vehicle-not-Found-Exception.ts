export class VehicleNotFoundException extends Error {
    constructor() {
      super("El método de movilidad elegido no es válido"); 
    }
}