export declare class CustomError extends Error {
    details: {
        errorCode: number;
        additionalInfo: string;
    };
    constructor(message: string, errorCode: number, additionalInfo: string);
}
