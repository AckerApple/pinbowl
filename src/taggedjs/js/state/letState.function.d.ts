import { GetSet } from './state.utils.js';
/** Used for variables that need to remain the same variable during render passes. If defaultValue is a function it is called only once, its return value is first state, and let value can changed */
export declare function letState<T>(defaultValue: T | (() => T)): ((getSet: GetSet<T>) => T);
