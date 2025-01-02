export class NotAvailableFuelException extends Error{
    constructor() {
        super("Actualmente no hay precio disponible para el carburante de tu vehículo.");
    }
}