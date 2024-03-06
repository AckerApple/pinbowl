export type Subscription = (() => void) & {
    unsubscribe: () => any;
};
type Subscriber = (value?: any) => any;
export interface SubjectLike {
    subscribe?: (callback: (value?: any) => any) => any;
    isSubject?: boolean;
}
export declare class Subject<T> implements SubjectLike {
    value?: T | undefined;
    isSubject: boolean;
    subscribers: Subscriber[];
    constructor(value?: T | undefined);
    subscribe(callback: Subscriber): Subscription;
    set(value: any): void;
    next: (value: any) => void;
}
export {};
