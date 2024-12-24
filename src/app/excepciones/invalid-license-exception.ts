export class InvalidLicenseException extends Error {
    constructor() {
      super("La matrícula introducida ya pertenece a otro vehículo."); 
    }
}