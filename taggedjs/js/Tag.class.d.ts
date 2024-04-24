import { Counts } from './interpolations/interpolateTemplate';
import { State } from './state';
import { InterpolatedTemplates } from './interpolations/interpolations';
import { InterpolateSubject } from './processSubjectValue.function';
import { TemplaterResult } from './TemplaterResult.class';
export declare const variablePrefix = "__tagvar";
export declare const escapeVariable: string;
export declare const escapeSearch: RegExp;
export type Context = {
    [index: string]: InterpolateSubject;
};
export type TagMemory = {
    state: State;
};
export interface TagTemplate {
    interpolation: InterpolatedTemplates;
    string: string;
    strings: string[];
    values: unknown[];
    context: Context;
}
export declare class Tag {
    strings: string[];
    values: any[];
    isTagClass: boolean;
    memory: {
        arrayValue?: unknown;
    };
    templater: TemplaterResult;
    constructor(strings: string[], values: any[]);
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue: unknown): this;
}
export type ElementBuildOptions = {
    counts: Counts;
    forceElement?: boolean;
};
