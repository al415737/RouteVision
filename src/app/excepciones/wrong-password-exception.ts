export class WrongPasswordException extends Error{
    constructor() {
        super("The password is incorrect");
    }
}