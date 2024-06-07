import { BaseTagSupport, TagSupport } from '../tag/TagSupport.class.js';
import { State } from './state.utils.js';
import { Callback } from './callbackMaker.function.js';
export default function callbackStateUpdate<T>(tagSupport: TagSupport | BaseTagSupport, callback: Callback<any, any, any, any, any, any, T>, oldState: State, ...args: any[]): T;
