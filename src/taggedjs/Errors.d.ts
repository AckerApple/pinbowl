export type TagErrorDetails = Record<string, unknown>;
export type TagErrorFullDetails = Record<string, unknown> & {
    errorCode: string;
};
export declare class TagError extends Error {
    details: TagErrorFullDetails;
    constructor(message: string, errorCode: string, details?: Record<string, unknown>);
}
export declare class ArrayNoKeyError extends TagError {
    constructor(message: string, details?: TagErrorDetails);
}
export declare class StateMismatchError extends TagError {
    constructor(message: string, details?: TagErrorDetails);
}
