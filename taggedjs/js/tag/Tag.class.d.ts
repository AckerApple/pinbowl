import { Counts } from '../interpolations/interpolateTemplate.js';
import { State } from '../state/index.js';
import { InterpolatedTemplates } from '../interpolations/interpolations.js';
import { InterpolateSubject } from './update/processFirstSubject.utils.js';
import { TemplaterResult } from './TemplaterResult.class.js';
import { TagValues } from './html.js';
import { ValueTypes } from './ValueTypes.enum.js';
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
    tagJsType: ValueTypes;
    memory: {
        arrayValue?: unknown;
    };
    templater: TemplaterResult;
    constructor(strings: string[], values: any[]);
    /** Used for array, such as array.map(), calls aka array.map(x => html``.key(x)) */
    key(arrayValue: unknown): this;
    children?: {
        strings: string[] | TemplateStringsArray;
        values: TagValues;
    };
    html(strings: string[] | TemplateStringsArray, ...values: TagValues): this;
}
export type ElementBuildOptions = {
    counts: Counts;
};
