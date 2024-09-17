import { InterpolateSubject } from '../tag/update/processFirstSubject.utils.js';
import { Support } from '../tag/Support.class.js';
export type Template = Element & {
    content: any;
};
export type InterpolateComponentResult = {
    subject: InterpolateSubject;
    insertBefore: Element | Text | Template;
    ownerSupport: Support;
    variableName: string;
};
export type Counts = {
    added: number;
    removed: number;
};
export type ElementBuildOptions = {
    counts: Counts;
};
