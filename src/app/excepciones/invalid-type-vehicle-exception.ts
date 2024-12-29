export class InvalidTypeVehicleException extends Error {
    constructor() {
      super("El tipo de vehículo introducido no es correcto."); 
    }
}