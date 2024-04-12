import { OperatorFunction, SubjectLike } from "./Subject.utils";
type WillCallback<T, R> = (lastValue: T, resolve: (result: R) => void) => void;
export declare function willCallback<T = any, R = any>(callback: WillCallback<T, R>): OperatorFunction<T, R, any>;
/** .pipe( promise((x) => Promise.resolve(44)) ) */
export declare function willPromise<T, H>(callback: (lastValue: T) => Promise<H>): OperatorFunction<T, H, any>;
/** .pipe( willSubscribe((x) => new ValueSubject(44)) ) */
export declare const willSubscribe: <T, H>(callback: (lastValue: T) => SubjectLike<H>) => OperatorFunction<T, H, any>;
export {};
