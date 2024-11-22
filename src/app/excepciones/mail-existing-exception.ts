export class MailExistingException extends Error{
    constructor() {
        super("In the system already exist that email");
    }
}