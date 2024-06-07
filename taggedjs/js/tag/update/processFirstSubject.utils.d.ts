import { TagArraySubject } from './processTagArray.js';
import { TemplaterResult } from '../TemplaterResult.class.js';
import { Counts, Template } from '../../interpolations/interpolateTemplate.js';
import { DisplaySubject, TagSubject } from '../../subject.types.js';
import { ValueSubject } from '../../subject/ValueSubject.js';
import { RegularValue } from './processRegularValue.function.js';
import { Callback } from '../../interpolations/bindSubjectCallback.function.js';
import { Tag } from '../Tag.class.js';
import { Subject } from '../../subject/index.js';
export type processOptions = {
    counts: Counts;
};
export type InterpolateSubject = (ValueSubject<undefined> | TagArraySubject | TagSubject | DisplaySubject | ValueSubject<Callback>) & {
    clone?: Element | Text | Template;
};
export type TemplateValue = Tag | TemplaterResult | (Tag | TemplaterResult)[] | RegularValue | Subject<any> | Callback;
