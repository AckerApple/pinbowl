export type Subscription = (() => void) & {
    unsubscribe: () => any;
};
type Subscriber = () => any;
export declare class Subject {
    subscribers: Subscriber[];
    value?: any;
    subscribe(callback: Subscriber): Subscription;
    set(value: any): void;
    next: (value: any) => void;
}
export {};
