import { AnySupport } from './Support.class.js';
import { Context } from './Context.types.js';
export declare function processUpdateContext(support: AnySupport, context: Context): Context;
/** returns boolean of did render */
export declare function processUpdateOneContext(values: unknown[], index: number, context: Context, ownerSupport: AnySupport): void;
