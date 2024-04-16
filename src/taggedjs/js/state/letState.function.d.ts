import { GetSet } from './state.utils';
/** Used for variables that need to remain the same variable during render passes */
export declare function letState<T>(defaultValue: T | (() => T)): ((getSet: GetSet<T>) => T);
