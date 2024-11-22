export class NullLicenseException extends Error {
    constructor(){
        super("Falta por introducir la matrícula.");
    }
}
