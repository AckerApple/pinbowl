import { TagGlobal } from '../TemplaterResult.class.js';
import { ValueSubject } from '../../subject/ValueSubject.js';
import { BasicTypes, ImmutableTypes, ValueType } from '../ValueTypes.enum.js';
export declare class TagJsSubject<T> extends ValueSubject<T> {
    tagJsType: ValueType;
    global: TagGlobal;
    constructor(value: any, valueType?: ValueType | ImmutableTypes | BasicTypes | undefined);
}
export declare function getNewGlobal(): TagGlobal;
