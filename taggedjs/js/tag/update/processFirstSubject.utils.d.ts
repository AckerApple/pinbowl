import { TagGlobal, TemplaterResult } from '../TemplaterResult.class.js';
import { ValueSubject } from '../../subject/ValueSubject.js';
import { RegularValue } from './processRegularValue.function.js';
import { Callback } from '../../interpolations/attributes/bindSubjectCallback.function.js';
import { StringTag } from '../Tag.class.js';
import { Subject } from '../../subject/index.js';
export type InterpolateSubject = (ValueSubject<unknown> | ValueSubject<Callback>) & {
    global: TagGlobal;
};
export type TemplateValue = StringTag | TemplaterResult | (StringTag | TemplaterResult)[] | RegularValue | Subject<unknown> | Callback;
