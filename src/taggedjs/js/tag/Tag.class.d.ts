import { State } from '../state/index.js';
import { InterpolatedTemplates } from '../interpolations/interpolations.js';
import { TemplaterResult } from './TemplaterResult.class.js';
import { TagValues } from './html.js';
import { ValueTypes } from './ValueTypes.enum.js';
import { DomMetaMap, LikeObjectChildren } from '../interpolations/optimizers/LikeObjectElement.type.js';
import { AnySupport } from './Support.class.js';
export declare const variablePrefix = ":tagvar";
export declare const variableSuffix = ":";
export type EventCallback = (event: Event) => any;
export type EventMem = {
    elm: Element;
    callback: EventCallback;
};
export type TagMemory = {
    state: State;
};
export interface TagTemplate {
    interpolation: InterpolatedTemplates;
    string: string;
    strings: string[];
    values: unknown[];
    domMetaMap?: DomMetaMap;
}
export type Tag = {
    values: unknown[];
    tagJsType?: typeof ValueTypes.tag | typeof ValueTypes.dom;
    templater?: TemplaterResult;
    ownerSupport?: AnySupport;
    arrayValue?: any;
};
export type KeyFunction = (arrayValue: unknown) => StringTag;
export type StringTag = Tag & {
    children?: {
        strings: string[] | TemplateStringsArray;
        values: TagValues;
    };
    strings: string[];
    values: unknown[];
    key: KeyFunction;
    html: (strings: string[] | TemplateStringsArray, values: TagValues) => StringTag;
};
export declare function getStringTag(strings: string[], values: unknown[]): StringTag;
export type DomTag = Tag & {
    children?: {
        dom: LikeObjectChildren;
        values: TagValues;
    };
    dom: LikeObjectChildren;
    values: unknown[];
    key: (arrayValue: unknown) => DomTag;
    html: {
        dom: (dom: LikeObjectChildren, // ObjectChildren
        values: TagValues) => DomTag;
    };
};
export declare function getDomTag(dom: LikeObjectChildren, values: unknown[]): DomTag;
