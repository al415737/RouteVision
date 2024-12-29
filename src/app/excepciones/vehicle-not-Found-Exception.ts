export class VehicleNotFoundException extends Error {
    constructor() {
      super("El vehículo no se ha encontrado."); 
    }
}