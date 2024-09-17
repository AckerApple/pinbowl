import { BasicTypes, ImmutableTypes, ValueType } from './ValueTypes.enum.js';
export type TypedValue = ImmutableTypes | BasicTypes | ValueType;
export declare function getValueType(value: any): TypedValue;
