export type Subscription = (() => void) & {
    unsubscribe: () => any;
};
type Subscriber = (value?: any) => any;
export interface SubjectLike {
    subscribe?: (callback: (value?: any) => any) => any;
    isSubject?: boolean;
}
export declare class Subject<T> implements SubjectLike {
    isSubject: boolean;
    subscribers: Subscriber[];
    value?: any;
    subscribe(callback: Subscriber): Subscription;
    set(value: any): void;
    next: (value: any) => void;
}
export {};
