export class CustomError extends Error {
    details;
    constructor(message, errorCode, additionalInfo) {
        super(message);
        this.name = 'CustomError';
        this.details = { errorCode, additionalInfo };
    }
}
//# sourceMappingURL=CustomError.js.map