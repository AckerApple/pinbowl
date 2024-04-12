import { GetSet } from './set.function';
/** Used for variables that need to remain the same variable during render passes */
export declare function setLet<T>(defaultValue: T | (() => T)): ((getSet: GetSet<T>) => T);
