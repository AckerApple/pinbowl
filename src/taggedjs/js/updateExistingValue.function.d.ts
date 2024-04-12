import { TagSupport } from './TagSupport.class';
import { Subject } from './subject/Subject.class';
import { TemplaterResult } from './TemplaterResult.class';
import { Tag } from './Tag.class';
import { InterpolateSubject } from './processSubjectValue.function';
import { RegularValue } from './processRegularValue.function';
import { InsertBefore } from './Clones.type';
export type ExistingValue = TemplaterResult | Tag[] | TagSupport | Function | Subject<unknown> | RegularValue | Tag;
export declare function updateExistingValue(subject: InterpolateSubject, value: ExistingValue, ownerTag: Tag, insertBefore: InsertBefore): InterpolateSubject;
