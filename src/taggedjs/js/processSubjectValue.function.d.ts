import { TagArraySubject } from './processTagArray';
import { TemplaterResult } from './TemplaterResult.class';
import { Clones, InsertBefore } from './Clones.type';
import { Counts } from './interpolations/interpolateTemplate';
import { DisplaySubject, TagSubject } from './subject.types';
import { ValueSubject } from './subject/ValueSubject';
import { RegularValue } from './processRegularValue.function';
import { Callback } from './interpolations/bindSubjectCallback.function';
import { TagSupport } from './TagSupport.class';
import { Tag } from './Tag.class';
import { Subject } from './subject';
type processOptions = {
    forceElement?: boolean;
    counts: Counts;
};
export type ClonesAndPromise = {
    clones: Clones;
};
export type InterpolateSubject = ValueSubject<undefined> | TagArraySubject | TagSubject | DisplaySubject | ValueSubject<Callback>;
export type TemplateValue = Tag | TemplaterResult | (Tag | TemplaterResult)[] | RegularValue | Subject<any> | Callback;
export declare function processSubjectValue(value: TemplateValue, subject: InterpolateSubject, // could be tag via result.tag
insertBefore: InsertBefore, // <template end interpolate /> (will be removed)
ownerSupport: TagSupport, // owner
options: processOptions): Clones | undefined;
export {};
