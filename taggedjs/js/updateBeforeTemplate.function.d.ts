import { NoDisplayValue } from './interpolations/attributes/processAttribute.function.js';
export declare function updateBeforeTemplate(value: string, // value should be casted before calling here
lastFirstChild: Text): Text;
type TextableValue = string | boolean | number | NoDisplayValue;
export declare function castTextValue(value: TextableValue): string;
export {};
