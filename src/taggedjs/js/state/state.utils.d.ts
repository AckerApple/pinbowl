import { firstLetState } from './letState.function.js';
import { BaseSupport, Support } from '../tag/Support.class.js';
import { runFirstState } from './stateHandlers.js';
import { State, StateConfig } from './state.types.js';
export type Config = {
    version: number;
    support?: BaseSupport | Support;
    array: State;
    rearray?: State;
    handlers: {
        handler: typeof runFirstState;
        letHandler: typeof firstLetState;
    };
};
export type GetSet<T> = (y: T) => [T, T];
export declare function initState(support: Support | BaseSupport, config: Config): void;
export declare function reState(support: Support | BaseSupport, config: Config): void;
export declare class StateEchoBack {
}
export declare function getCallbackValue<T>(callback: StateConfig<T>): [T, T];
