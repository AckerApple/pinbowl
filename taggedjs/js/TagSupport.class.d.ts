import { Props } from './Props';
import { TagMemory } from './Tag.class';
import { TemplaterResult } from './TemplaterResult.class';
import { TagSubject } from './Tag.utils';
export declare class BaseTagSupport {
    templater: TemplaterResult;
    subject: TagSubject;
    isApp: boolean;
    propsConfig: {
        latest: Props;
        latestCloned: Props;
        lastClonedKidValues: unknown[][];
        clonedProps: Props;
    };
    memory: TagMemory;
    constructor(templater: TemplaterResult, subject: TagSubject);
}
export declare class TagSupport extends BaseTagSupport {
    ownerTagSupport: TagSupport;
    templater: TemplaterResult;
    subject: TagSubject;
    isApp: boolean;
    constructor(ownerTagSupport: TagSupport, templater: TemplaterResult, subject: TagSubject);
}
